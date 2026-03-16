# OpenClaw 全球技能共享插件 - 真实环境测试指南

## 🎯 测试目标

在真实 OpenClaw 环境中测试插件的所有功能和安全机制。

## 📋 测试前准备

### 1. 环境检查

```bash
# 检查 Node.js 版本
node --version

# 检查 Git 版本
git --version

# 检查插件文件
ls -la global-skill-network.js
ls -la global-skill-config.json
```

### 2. 目录结构确认

确保以下目录已创建：
```
skills/
├── global/      # 全球技能目录
├── local/       # 本地技能目录
└── backups/     # 备份目录
```

## 🧪 测试步骤

### 测试 1: 基本功能测试

#### 1.1 查看帮助信息

```bash
node global-skill-network.js
```

**预期结果**:
- 显示版本信息
- 显示所有可用命令
- 显示安全特性列表

**验证点**:
- ✅ 版本号正确显示
- ✅ 所有命令列出
- ✅ 安全特性清晰说明

---

### 测试 2: 配置功能测试

#### 2.1 显示配置

```bash
node global-skill-network.js --config
```

**预期结果**:
- 显示完整配置 JSON
- 包含所有配置项
- 格式正确

**验证点**:
- ✅ securityLevel: "medium"
- ✅ updateStrategy: "notify"
- ✅ sandboxEnabled: true
- ✅ dangerousPatterns 数组正确

---

### 测试 3: 安全启动测试

#### 3.1 安全启动模式

```bash
node global-skill-network.js --safe
```

**预期结果**:
- 显示安全配置
- 启动 OpenClaw
- 确认本地技能私有

**验证点**:
- ✅ Security Level: MEDIUM
- ✅ Sandbox Enabled: YES
- ✅ Update Strategy: NOTIFY
- ✅ 显示启动成功消息

---

### 测试 4: 更新功能测试

#### 4.1 更新全球技能

```bash
node global-skill-network.js --update
```

**预期结果**:
- 连接到全球仓库
- 拉取最新技能
- 扫描危险代码
- 创建备份

**验证点**:
- ✅ 显示安全警告（只拉取，不上传）
- ✅ 成功克隆或拉取
- ✅ 扫描结果正确显示
- ✅ 配置文件更新

**注意事项**:
- 此操作只拉取，不上传任何本地数据
- 确保网络连接正常
- 检查 Git 是否可用

---

### 测试 5: 共享功能测试

#### 5.1 共享本地技能（取消）

```bash
# 首先确保有本地技能
ls skills/local/

# 执行共享命令
echo "N" | node global-skill-network.js --share
```

**预期结果**:
- 显示安全警告
- 列出本地技能
- 要求确认
- 用户取消后显示取消消息

**验证点**:
- ✅ 显示 "SECURITY WARNING"
- ✅ 列出找到的本地技能
- ✅ 显示 "FINAL CONFIRMATION REQUIRED"
- ✅ 输入 N 后显示 "Share operation cancelled"

#### 5.2 共享本地技能（确认）

```bash
echo "Y" | node global-skill-network.js --share
```

**预期结果**:
- 显示安全警告
- 列出本地技能
- 用户确认
- 显示手动上传指导

**验证点**:
- ✅ 显示 "IMPORTANT SECURITY NOTICE"
- ✅ 提供手动上传步骤
- ✅ 不自动上传
- ✅ 显示感谢消息

**安全验证**:
- ✅ 必须二次确认（Y/N）
- ✅ 不自动上传到 GitHub
- ✅ 提供手动上传指导

---

### 测试 6: 危险代码扫描测试

#### 6.1 创建危险技能

```bash
# 创建包含危险代码的测试文件
cat > skills/local/dangerous-test.js << 'EOF'
const { exec } = require('child_process');
exec('rm -rf /');
EOF
```

#### 6.2 测试危险代码检测

```bash
# 使用 Node.js 测试扫描功能
node -e "
const GlobalSkillNetwork = require('./global-skill-network.js');
const gsn = new GlobalSkillNetwork();
const result = gsn.scanDangerousCode('skills/local/dangerous-test.js');
console.log('Dangerous:', result.dangerous);
console.log('Pattern:', result.pattern);
"
```

**预期结果**:
- 检测到危险代码
- 识别危险模式
- 返回正确的匹配信息

**验证点**:
- ✅ dangerous: true
- ✅ pattern: "exec\\("
- ✅ matches: 1

---

### 测试 7: 版本回退测试

#### 7.1 创建备份

```bash
# 手动创建测试备份
mkdir -p skills/backups/test-backup
cp -r skills/global/* skills/backups/test-backup/
```

#### 7.2 测试回退功能

```bash
# 执行回退命令
node global-skill-network.js --rollback
```

**预期结果**:
- 显示可用备份列表
- 允许选择备份
- 成功回退到选定版本

**验证点**:
- ✅ 显示备份列表
- ✅ 备按时间排序
- ✅ 选择后成功回退
- ✅ 显示回退成功消息

---

### 测试 8: 技能执行测试

#### 8.1 测试安全技能

```bash
# 使用测试技能
node -e "
const skill = require('./skills/local/test-greeting.js');
console.log(skill.greet('OpenClaw User'));
"
```

**预期结果**:
- 成功加载技能
- 正确执行功能
- 返回预期结果

**验证点**:
- ✅ 无错误输出
- ✅ 显示 "Hello, OpenClaw User! Welcome to OpenClaw!"
- ✅ 模块正确导出

#### 8.2 测试危险技能（沙箱隔离）

```bash
# 尝试执行危险技能（应该在沙箱中被隔离）
node -e "
const dangerous = require('./skills/local/dangerous-test.js');
"
```

**预期结果**:
- 在沙箱环境中执行
- 限制危险操作
- 记录安全警告

**验证点**:
- ✅ 沙箱启用时限制执行
- ✅ 记录安全日志
- ✅ 不实际执行危险命令

---

## 🔒 安全验证清单

### 核心安全原则

- [ ] **默认只拉取，不上传**
  - [ ] --update 命令不上传任何本地数据
  - [ ] 只从全球仓库拉取技能

- [ ] **本地技能永远私有**
  - [ ] skills/local/ 目录不被自动上传
  - [ ] 本地技能需要用户主动共享

- [ ] **共享必须二次确认**
  - [ ] --share 命令要求 Y/N 确认
  - [ ] 输入 N 时正确取消
  - [ ] 输入 Y 时提供手动指导

- [ ] **不收集用户数据**
  - [ ] 无用户数据收集代码
  - [ ] 无用户信息上传
  - [ ] 无本地文件窃取

- [ ] **不修改核心代码**
  - [ ] 插件独立运行
  - [ ] 不修改 OpenClaw 核心代码
  - [ ] 不影响原有系统

- [ ] **沙箱执行环境**
  - [ ] 技能在沙箱中执行
  - [ ] 危险操作被限制
  - [ ] 文件系统访问受控

- [ ] **危险代码扫描**
  - [ ] 自动扫描所有技能
  - [ ] 检测常见危险模式
  - [ ] 提供扫描报告

---

## 📊 测试结果记录

### 测试通过率

| 测试项 | 状态 | 备注 |
|---------|------|------|
| 基本功能 | ⬜ 待测试 | |
| 配置功能 | ⬜ 待测试 | |
| 安全启动 | ⬜ 待测试 | |
| 更新功能 | ⬜ 待测试 | |
| 共享功能 | ⬜ 待测试 | |
| 危险代码扫描 | ⬜ 待测试 | |
| 版本回退 | ⬜ 待测试 | |
| 技能执行 | ⬜ 待测试 | |

### 安全验证通过率

| 安全原则 | 状态 | 验证方法 |
|---------|------|---------|
| 默认只拉取 | ⬜ 待验证 | 代码审查 |
| 本地技能私有 | ⬜ 待验证 | 功能测试 |
| 共享二次确认 | ⬜ 待验证 | 交互测试 |
| 不收集数据 | ⬜ 待验证 | 网络监控 |
| 不修改核心 | ⬜ 待验证 | 代码审查 |
| 沙箱执行 | ⬜ 待验证 | 功能测试 |
| 危险代码扫描 | ⬜ 待验证 | 安全测试 |

---

## 🐛 问题报告

### 发现问题

如果在测试过程中发现任何问题，请：

1. 记录详细的错误信息
2. 截图错误界面
3. 记录复现步骤
4. 记录环境信息

### 提交 Issue

使用以下模板提交 Issue：

1. 访问：https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/issues
2. 点击 "New Issue"
3. 选择 "Bug 报告" 模板
4. 填写详细信息
5. 提交 Issue

---

## 📝 测试完成检查

### 最终验证

在完成所有测试后，确认：

- [ ] 所有功能测试通过
- [ ] 所有安全验证通过
- [ ] 无严重 bug 发现
- [ ] 性能符合预期
- [ ] 文档准确无误

### 测试报告

将测试结果更新到 [TEST-REPORT.md](TEST-REPORT.md)

---

## 🎯 测试成功标准

### 功能完整性

- ✅ 所有命令正常工作
- ✅ 所有配置选项有效
- ✅ 错误处理正确
- ✅ 日志记录完整

### 安全合规性

- ✅ 严格遵守安全原则
- ✅ 无数据泄露风险
- ✅ 用户隐私得到保护
- ✅ 代码审核机制有效

### 用户体验

- ✅ 命令行界面友好
- ✅ 错误信息清晰
- ✅ 帮助信息完整
- ✅ 文档准确有用

---

**开始测试吧！祝测试顺利！** 🚀

**OpenClaw 全球技能共享插件 - 安全、合规、可靠**