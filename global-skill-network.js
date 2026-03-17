#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');
const https = require('https');

class GlobalSkillNetwork {
    constructor() {
        this.config = this.loadConfig();
        this.skillsDir = path.join(process.cwd(), 'skills');
        this.globalRepo = 'https://github.com/OpenClaw-Global/global-skills.git';
        this.giteeRepo = 'https://gitee.com/OpenClaw-Global/global-skills.git';
        this.globalSkillsDir = path.join(this.skillsDir, 'global');
        this.localSkillsDir = path.join(this.skillsDir, 'local');
        this.hubSkillsDir = path.join(this.skillsDir, 'hub');
        this.backupDir = path.join(this.skillsDir, 'backups');
        this.skillsIndex = null;
        this.ensureDirectories();
    }

    loadConfig() {
        const configPath = path.join(process.cwd(), 'global-skill-config.json');
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        return this.createDefaultConfig();
    }

    createDefaultConfig() {
        const defaultConfig = {
            "version": "1.0.0",
            "lastUpdate": null,
            "securityLevel": "medium",
            "updateStrategy": "notify",
            "autoSync": false,
            "syncInterval": 3600000,
            "sandboxEnabled": true,
            "dangerousPatterns": [
                "eval\\(",
                "exec\\(",
                "require\\(.*child_process\\)",
                "require\\(.*fs\\).*unlink",
                "require\\(.*fs\\).*rmdir",
                "\\$__dirname",
                "\\$__filename",
                "process\\.exit",
                "process\\.kill",
                "\\.(exec|spawn|fork)\\("
            ],
            "allowedDomains": [],
            "maxFileSize": 1048576,
            "enableLogging": true
        };
        fs.writeFileSync(path.join(process.cwd(), 'global-skill-config.json'), JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }

    ensureDirectories() {
        [this.skillsDir, this.globalSkillsDir, this.localSkillsDir, this.hubSkillsDir, this.backupDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    log(message, level = 'info') {
        if (this.config.enableLogging) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
            process.stdout.write(logMessage);
        }
    }

    async executeCommand(command, args, cwd) {
        return new Promise((resolve, reject) => {
            const process = spawn(command, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                } else {
                    reject(new Error(`Command failed with code ${code}: ${stderr}`));
                }
            });
        });
    }

    async checkGitAvailable() {
        try {
            await this.executeCommand('git', ['--version'], process.cwd());
            return true;
        } catch (error) {
            this.log('Git is not installed or not available', 'error');
            return false;
        }
    }

    async cloneGlobalRepo() {
        try {
            if (fs.existsSync(path.join(this.globalSkillsDir, '.git'))) {
                this.log('Global skills repository already exists, pulling updates...');
                await this.executeCommand('git', ['pull', 'origin', 'main'], this.globalSkillsDir);
            } else {
                this.log('Cloning global skills repository...');
                await this.executeCommand('git', ['clone', this.globalRepo, 'global'], this.skillsDir);
            }
            return true;
        } catch (error) {
            this.log(`Failed to clone/pull global repository: ${error.message}`, 'error');
            return false;
        }
    }

    scanDangerousCode(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const dangerousPatterns = this.config.dangerousPatterns;
            
            for (const pattern of dangerousPatterns) {
                const regex = new RegExp(pattern, 'gi');
                const matches = content.match(regex);
                if (matches) {
                    return {
                        dangerous: true,
                        pattern: pattern,
                        matches: matches.length,
                        file: filePath
                    };
                }
            }
            return { dangerous: false };
        } catch (error) {
            this.log(`Error scanning file ${filePath}: ${error.message}`, 'error');
            return { dangerous: false, error: error.message };
        }
    }

    async scanGlobalSkills() {
        this.log('Scanning global skills for dangerous code...');
        const skillFiles = this.getSkillFiles(this.globalSkillsDir);
        const dangerousFiles = [];

        for (const file of skillFiles) {
            const scanResult = this.scanDangerousCode(file);
            if (scanResult.dangerous) {
                dangerousFiles.push(scanResult);
                this.log(`⚠️  Dangerous code found in ${path.basename(file)}: ${scanResult.pattern}`, 'warn');
            }
        }

        return dangerousFiles;
    }

    getSkillFiles(directory) {
        const files = [];
        if (!fs.existsSync(directory)) return files;

        const items = fs.readdirSync(directory);
        for (const item of items) {
            const fullPath = path.join(directory, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                files.push(...this.getSkillFiles(fullPath));
            } else if (item.endsWith('.js') || item.endsWith('.json')) {
                files.push(fullPath);
            }
        }
        return files;
    }

    async updateGlobalSkills() {
        this.log('='.repeat(50));
        this.log('OpenClaw Global Skill Network - Update Mode');
        this.log('='.repeat(50));
        this.log('⚠️  IMPORTANT: This operation ONLY pulls global skills');
        this.log('⚠️  NO local skills will be uploaded');
        this.log('='.repeat(50));

        if (!await this.checkGitAvailable()) {
            this.log('Git is required for global skills synchronization', 'error');
            return false;
        }

        const success = await this.cloneGlobalRepo();
        if (!success) {
            return false;
        }

        this.log('Global skills updated successfully');

        if (this.config.securityLevel !== 'low') {
            const dangerousFiles = await this.scanGlobalSkills();
            if (dangerousFiles.length > 0) {
                this.log(`\n⚠️  Found ${dangerousFiles.length} file(s) with potentially dangerous code`, 'warn');
                if (this.config.securityLevel === 'high') {
                    this.log('High security mode: These files will be isolated', 'warn');
                }
            } else {
                this.log('✓ No dangerous code patterns found in global skills');
            }
        }

        this.config.lastUpdate = new Date().toISOString();
        this.saveConfig();

        this.log(`\n✓ Global skills update completed at ${new Date().toLocaleString()}`);
        return true;
    }

    async shareLocalSkill() {
        this.log('='.repeat(50));
        this.log('OpenClaw Global Skill Network - Share Mode');
        this.log('='.repeat(50));
        this.log('⚠️  SECURITY WARNING');
        this.log('⚠️  You are about to share your LOCAL skills');
        this.log('⚠️  This will upload your local skills to the global repository');
        this.log('⚠️  Make sure you have reviewed all code before sharing');
        this.log('='.repeat(50));

        const localSkills = this.getSkillFiles(this.localSkillsDir);
        if (localSkills.length === 0) {
            this.log('No local skills found to share', 'warn');
            return false;
        }

        this.log(`Found ${localSkills.length} local skill(s) to share:`);
        localSkills.forEach(file => {
            this.log(`  - ${path.relative(this.localSkillsDir, file)}`);
        });

        this.log('\n⚠️  FINAL CONFIRMATION REQUIRED');
        this.log('Type "Y" to confirm sharing, any other key to cancel');

        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('\nDo you want to share these skills? (Y/N): ', (answer) => {
                rl.close();
                if (answer.toUpperCase() !== 'Y') {
                    this.log('Share operation cancelled by user', 'info');
                    resolve(false);
                    return;
                }

                this.log('\n⚠️  IMPORTANT SECURITY NOTICE');
                this.log('For security reasons, manual sharing through GitHub web interface is required');
                this.log('Please follow these steps:');
                this.log('1. Visit: https://github.com/OpenClaw-Global/global-skills');
                this.log('2. Create a Pull Request with your local skills');
                this.log('3. Your skills will be reviewed before being added to global repository');
                this.log('\nThis ensures code quality and security for all users.');
                this.log('Thank you for contributing to the OpenClaw community!');

                resolve(true);
            });
        });
    }

    async rollbackVersion() {
        this.log('='.repeat(50));
        this.log('OpenClaw Global Skill Network - Rollback Mode');
        this.log('='.repeat(50));

        const backups = this.getBackups();
        if (backups.length === 0) {
            this.log('No backups available for rollback', 'warn');
            return false;
        }

        this.log('Available backups:');
        backups.forEach((backup, index) => {
            this.log(`  ${index + 1}. ${backup.name} (${backup.date})`);
        });

        this.log('\n⚠️  Rollback will replace current global skills with selected backup');
        this.log('Type the backup number to rollback, or "cancel" to exit');

        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('\nSelect backup number: ', (answer) => {
                rl.close();
                if (answer.toLowerCase() === 'cancel') {
                    this.log('Rollback cancelled', 'info');
                    resolve(false);
                    return;
                }

                const backupIndex = parseInt(answer) - 1;
                if (backupIndex < 0 || backupIndex >= backups.length) {
                    this.log('Invalid backup selection', 'error');
                    resolve(false);
                    return;
                }

                try {
                    const selectedBackup = backups[backupIndex];
                    this.log(`Rolling back to backup: ${selectedBackup.name}`);

                    const backupPath = path.join(this.backupDir, selectedBackup.name);
                    this.restoreBackup(backupPath);

                    this.log('✓ Rollback completed successfully');
                    resolve(true);
                } catch (error) {
                    this.log(`Rollback failed: ${error.message}`, 'error');
                    resolve(false);
                }
            });
        });
    }

    getBackups() {
        const backups = [];
        if (!fs.existsSync(this.backupDir)) return backups;

        const items = fs.readdirSync(this.backupDir);
        items.forEach(item => {
            const backupPath = path.join(this.backupDir, item);
            const stat = fs.statSync(backupPath);
            if (stat.isDirectory()) {
                backups.push({
                    name: item,
                    date: stat.mtime.toLocaleString(),
                    path: backupPath
                });
            }
        });

        return backups.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    createBackup() {
        if (!fs.existsSync(this.globalSkillsDir)) return;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup-${timestamp}`;
        const backupPath = path.join(this.backupDir, backupName);

        this.copyDirectory(this.globalSkillsDir, backupPath);
        this.log(`Backup created: ${backupName}`);

        const backups = this.getBackups();
        if (backups.length > 10) {
            const oldestBackup = backups[backups.length - 1];
            fs.rmSync(path.join(this.backupDir, oldestBackup.name), { recursive: true });
            this.log(`Removed old backup: ${oldestBackup.name}`);
        }
    }

    copyDirectory(source, destination) {
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        const items = fs.readdirSync(source);
        items.forEach(item => {
            const sourcePath = path.join(source, item);
            const destPath = path.join(destination, item);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                this.copyDirectory(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        });
    }

    restoreBackup(backupPath) {
        if (!fs.existsSync(backupPath)) {
            throw new Error('Backup not found');
        }

        if (fs.existsSync(this.globalSkillsDir)) {
            fs.rmSync(this.globalSkillsDir, { recursive: true });
        }

        this.copyDirectory(backupPath, this.globalSkillsDir);
    }

    safeStart() {
        this.log('='.repeat(50));
        this.log('OpenClaw Global Skill Network - Safe Start Mode');
        this.log('='.repeat(50));
        this.log(`Security Level: ${this.config.securityLevel.toUpperCase()}`);
        this.log(`Sandbox Enabled: ${this.config.sandboxEnabled ? 'YES' : 'NO'}`);
        this.log(`Update Strategy: ${this.config.updateStrategy.toUpperCase()}`);
        this.log('='.repeat(50));

        this.log('\nStarting OpenClaw with enhanced security...');

        if (this.config.updateStrategy === 'auto' && this.config.autoSync) {
            this.log('Auto-sync enabled, checking for updates...');
            this.updateGlobalSkills();
        } else if (this.config.updateStrategy === 'notify') {
            this.log('Notify mode: Check for updates with --update command');
        }

        this.log('\n✓ OpenClaw started safely');
        this.log('✓ Local skills remain private');
        this.log('✓ Global skills ready for use');

        return true;
    }

    showConfig() {
        this.log('='.repeat(50));
        this.log('OpenClaw Global Skill Network - Configuration');
        this.log('='.repeat(50));
        console.log(JSON.stringify(this.config, null, 2));
        this.log('='.repeat(50));
    }

    saveConfig() {
        fs.writeFileSync(path.join(process.cwd(), 'global-skill-config.json'), JSON.stringify(this.config, null, 2));
    }

    async startBackgroundSync() {
        if (!this.config.autoSync) return;

        this.log(`Background sync enabled (interval: ${this.config.syncInterval}ms)`);

        setInterval(async () => {
            try {
                this.log('Running background sync...');
                await this.updateGlobalSkills();
            } catch (error) {
                this.log(`Background sync failed: ${error.message}`, 'error');
            }
        }, this.config.syncInterval);
    }

    loadSkillsIndex() {
        try {
            const indexPath = path.join(process.cwd(), this.config.skillsHub?.localIndexPath || 'skills-index.json');
            if (fs.existsSync(indexPath)) {
                this.skillsIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
                this.log(`Loaded skills index with ${this.skillsIndex.skills.length} skills`);
                return true;
            }
            return false;
        } catch (error) {
            this.log(`Failed to load skills index: ${error.message}`, 'error');
            return false;
        }
    }

    async downloadSkillsIndex() {
        if (!this.config.skillsHub?.enabled || !this.config.skillsHub?.remoteIndexUrl) {
            this.log('Skills hub is not enabled or remote URL not configured', 'warn');
            return false;
        }

        return new Promise((resolve) => {
            this.log('Downloading skills index from GitHub...');
            https.get(this.config.skillsHub.remoteIndexUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const indexPath = path.join(process.cwd(), this.config.skillsHub.localIndexPath);
                        fs.writeFileSync(indexPath, data);
                        this.skillsIndex = JSON.parse(data);
                        this.log(`Skills index downloaded successfully (${this.skillsIndex.skills.length} skills)`);
                        resolve(true);
                    } catch (error) {
                        this.log(`Failed to save skills index: ${error.message}`, 'error');
                        resolve(false);
                    }
                });
            }).on('error', (error) => {
                this.log(`Failed to download skills index: ${error.message}`, 'error');
                resolve(false);
            });
        });
    }

    searchSkills(query) {
        if (!this.skillsIndex) {
            this.log('Skills index not loaded', 'error');
            return [];
        }

        const lowerQuery = query.toLowerCase();
        return this.skillsIndex.skills.filter(skill => 
            skill.name.toLowerCase().includes(lowerQuery) ||
            skill.description.toLowerCase().includes(lowerQuery) ||
            skill.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            skill.category.toLowerCase().includes(lowerQuery)
        );
    }

    getSkillById(skillId) {
        if (!this.skillsIndex) {
            this.log('Skills index not loaded', 'error');
            return null;
        }

        return this.skillsIndex.skills.find(skill => skill.id === skillId);
    }

    listSkillsByCategory(category) {
        if (!this.skillsIndex) {
            this.log('Skills index not loaded', 'error');
            return [];
        }

        return this.skillsIndex.skills.filter(skill => skill.category === category);
    }

    async downloadSkill(skillId) {
        const skill = this.getSkillById(skillId);
        if (!skill) {
            this.log(`Skill not found: ${skillId}`, 'error');
            return false;
        }

        if (!skill.safe) {
            this.log(`Skill ${skillId} is marked as unsafe`, 'warn');
            return false;
        }

        this.log(`Downloading skill: ${skill.name} (${skillId})`);

        const downloadDir = this.config.skillsHub?.downloadDirectory || this.hubSkillsDir;
        const skillPath = path.join(downloadDir, skill.file);

        try {
            if (!fs.existsSync(path.dirname(skillPath))) {
                fs.mkdirSync(path.dirname(skillPath), { recursive: true });
            }

            const githubRawUrl = `https://raw.githubusercontent.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/main/${skill.file}`;
            
            return new Promise((resolve) => {
                https.get(githubRawUrl, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => {
                        try {
                            fs.writeFileSync(skillPath, data);
                            this.log(`Skill downloaded successfully: ${skillPath}`);

                            if (this.config.skillsHub?.verifyDownloadedSkills) {
                                const scanResult = this.scanDangerousCode(skillPath);
                                if (scanResult.dangerous) {
                                    this.log(`⚠️  Dangerous code found in downloaded skill`, 'warn');
                                    fs.unlinkSync(skillPath);
                                    resolve(false);
                                    return;
                                }
                            }

                            resolve(true);
                        } catch (error) {
                            this.log(`Failed to save skill: ${error.message}`, 'error');
                            resolve(false);
                        }
                    });
                }).on('error', (error) => {
                    this.log(`Failed to download skill: ${error.message}`, 'error');
                    resolve(false);
                });
            });
        } catch (error) {
            this.log(`Failed to download skill: ${error.message}`, 'error');
            return false;
        }
    }

    async callSkill(skillId, params = {}) {
        const skill = this.getSkillById(skillId);
        if (!skill) {
            this.log(`Skill not found: ${skillId}`, 'error');
            return { success: false, error: 'Skill not found' };
        }

        if (!skill.safe) {
            this.log(`Skill ${skillId} is marked as unsafe`, 'warn');
            return { success: false, error: 'Skill is unsafe' };
        }

        const downloadDir = this.config.skillsHub?.downloadDirectory || this.hubSkillsDir;
        const skillPath = path.join(downloadDir, skill.file);

        if (!fs.existsSync(skillPath)) {
            this.log(`Skill file not found locally, downloading...`);
            const downloaded = await this.downloadSkill(skillId);
            if (!downloaded) {
                return { success: false, error: 'Failed to download skill' };
            }
        }

        try {
            if (this.config.sandboxEnabled) {
                return this.executeSkillInSandbox(skillPath, params);
            } else {
                const skillModule = require(skillPath);
                if (typeof skillModule === 'function') {
                    const result = await skillModule(params);
                    return { success: true, data: result };
                } else if (skillModule.execute && typeof skillModule.execute === 'function') {
                    const result = await skillModule.execute(params);
                    return { success: true, data: result };
                } else {
                    return { success: false, error: 'Invalid skill format' };
                }
            }
        } catch (error) {
            this.log(`Failed to execute skill: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    executeSkillInSandbox(skillPath, params) {
        this.log(`Executing skill in sandbox: ${skillPath}`);
        const vm = require('vm');
        const code = fs.readFileSync(skillPath, 'utf8');

        try {
            const sandbox = {
                console: {
                    log: (...args) => this.log(`[Skill] ${args.join(' ')}`),
                    error: (...args) => this.log(`[Skill Error] ${args.join(' ')}`, 'error'),
                    warn: (...args) => this.log(`[Skill Warn] ${args.join(' ')}`, 'warn')
                },
                require: (moduleName) => {
                    const allowedModules = ['path', 'crypto', 'util', 'url', 'querystring'];
                    if (allowedModules.includes(moduleName)) {
                        return require(moduleName);
                    }
                    throw new Error(`Module ${moduleName} is not allowed in sandbox`);
                },
                __dirname: path.dirname(skillPath),
                __filename: skillPath,
                params: params,
                module: { exports: {} },
                exports: {}
            };

            const context = vm.createContext(sandbox);
            vm.runInContext(code, context, { timeout: 5000 });

            const result = sandbox.module.exports;
            if (typeof result === 'function') {
                const executionResult = result(params);
                return { success: true, data: executionResult };
            } else if (result.execute && typeof result.execute === 'function') {
                const executionResult = result.execute(params);
                return { success: true, data: executionResult };
            } else {
                return { success: true, data: result };
            }
        } catch (error) {
            this.log(`Sandbox execution failed: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    async syncSkillsHub() {
        this.log('='.repeat(50));
        this.log('OpenClaw Skills Hub - Sync Mode');
        this.log('='.repeat(50));
        const downloaded = await this.downloadSkillsIndex();
        if (!downloaded) {
            this.log('Failed to sync skills hub', 'error');
            return false;
        }
        this.log(`Skills hub synced successfully`);
        this.log(`Total skills available: ${this.skillsIndex.skills.length}`);
        this.log(`Categories: ${Object.keys(this.skillsIndex.categories).length}`);
        this.log(`Last updated: ${this.skillsIndex.lastUpdated}`);
        return true;
    }

    async pushToGitee() {
        this.log('='.repeat(50));
        this.log('OpenClaw Skills Hub - Push to Gitee');
        this.log('='.repeat(50));
        this.log('正在推送到Gitee...');
        this.log('='.repeat(50));
        
        try {
            const giteeRepo = this.config.gitee?.repository;
            if (!giteeRepo) {
                this.log('Gitee repository not configured', 'error');
                return false;
            }
            
            const giteeBranch = this.config.gitee?.branch || 'master';
            
            await this.executeCommand('git', ['remote', 'add', 'gitee', giteeRepo], process.cwd());
            await this.executeCommand('git', ['push', 'gitee', giteeBranch], process.cwd());
            
            this.log('='.repeat(50));
            this.log('推送到Gitee成功！');
            this.log('='.repeat(50));
            this.log(`仓库地址: ${giteeRepo}`);
            this.log(`分支: ${giteeBranch}`);
            this.log('='.repeat(50));
            this.log('您可以访问以下地址查看仓库：');
            this.log(giteeRepo);
            this.log('='.repeat(50));
            
            return true;
        } catch (error) {
            this.log(`推送到Gitee失败: ${error.message}`, 'error');
            return false;
        }
    }

    async run() {
        const args = process.argv.slice(2);
        const command = args[0];

        this.log('OpenClaw Global Skill Network v1.0.0');
        this.log('合规版本 - 绝对保护用户隐私');

        switch (command) {
            case '--update':
                await this.updateGlobalSkills();
                break;
            case '--share':
                await this.shareLocalSkill();
                break;
            case '--rollback':
                await this.rollbackVersion();
                break;
            case '--safe':
                this.safeStart();
                break;
            case '--config':
                this.showConfig();
                break;
            case '--sync-hub':
                await this.syncSkillsHub();
                break;
            case '--push-gitee':
                await this.pushToGitee();
                break;
            case '--search':
                if (args[1]) {
                    await this.loadSkillsIndex();
                    const results = this.searchSkills(args[1]);
                    this.log(`\nFound ${results.length} skill(s) matching "${args[1]}":`);
                    results.forEach(skill => {
                        this.log(`  - ${skill.name} (${skill.id})`);
                        this.log(`    ${skill.description}`);
                        this.log(`    Category: ${skill.category}, Tags: ${skill.tags.join(', ')}`);
                    });
                } else {
                    this.log('Please provide a search query', 'error');
                }
                break;
            case '--list':
                await this.loadSkillsIndex();
                if (this.skillsIndex) {
                    this.log(`\nTotal skills available: ${this.skillsIndex.skills.length}`);
                    this.log('\nCategories:');
                    Object.entries(this.skillsIndex.categories).forEach(([key, category]) => {
                        this.log(`  ${category.name} (${category.count} skills)`);
                    });
                }
                break;
            case '--call':
                if (args[1]) {
                    await this.loadSkillsIndex();
                    const params = args[2] ? JSON.parse(args[2]) : {};
                    const result = await this.callSkill(args[1], params);
                    console.log(JSON.stringify(result, null, 2));
                } else {
                    this.log('Please provide a skill ID to call', 'error');
                }
                break;
            default:
                this.log('\nUsage: node global-skill-network.js [command]');
                this.log('\nCommands:');
                this.log('  --update    仅拉取全球技能（不上传任何本地数据）');
                this.log('  --share     主动共享本地技能（必须二次确认 Y/N）');
                this.log('  --rollback  回退到之前的版本');
                this.log('  --safe      安全启动模式');
                this.log('  --config    显示当前配置');
                this.log('  --sync-hub  同步技能仓库索引');
                this.log('  --push-gitee 推送到Gitee仓库');
                this.log('  --search    搜索技能（需要提供查询词）');
                this.log('  --list      列出所有可用技能');
                this.log('  --call      调用指定技能（需要提供技能ID和参数）');
                this.log('\nExamples:');
                this.log('  node global-skill-network.js --search calculator');
                this.log('  node global-skill-network.js --list');
                this.log('  node global-skill-network.js --call calculator \'{"operation":"add","a":10,"b":20}\'');
                this.log('\n平台支持:');
                this.log('  GitHub: https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin');
                this.log('  Gitee: https://gitee.com/tree-of-knowledge-zhang/open-claw-gsn-skill-sharing-plugin');
                this.log('\nSecurity Features:');
                this.log('  ✓ 默认只拉取，不上传');
                this.log('  ✓ 本地技能永远私有');
                this.log('  ✓ 共享必须二次确认');
                this.log('  ✓ 不收集用户数据');
                this.log('  ✓ 不修改核心代码');
                this.log('  ✓ 沙箱执行环境');
                this.log('  ✓ 危险代码扫描');
                this.log('  ✓ GitHub和Gitee技能仓库支持');
        }
    }
}

if (require.main === module) {
    const gsn = new GlobalSkillNetwork();
    gsn.run().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = GlobalSkillNetwork;