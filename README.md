# OpenClaw 全球技能共享插件 (合规最终版)

## 📋 简介

OpenClaw 全球技能共享插件是一个安全、合规的技能同步系统，严格遵循用户隐私保护原则。本插件默认只拉取全球公共技能，不上传任何用户本地数据，确保用户技能永远私有。

## 🔒 核心安全原则

### ✅ 绝对遵守的规则

1. **默认只拉取，不上传**
   - 所有操作默认为只读模式
   - 不会自动上传任何本地技能
   - 用户本地技能永远保持私有

2. **主动共享机制**
   - 共享必须用户主动执行 `--share` 命令
   - 必须二次确认 (输入 Y) 才允许上传
   - 提供清晰的警告和确认流程

3. **零数据收集**
   - 不收集任何用户数据
   - 不上传用户信息
   - 不窃取任何本地文件

4. **核心代码保护**
   - 不修改 OpenClaw 核心代码
   - 插件独立运行，不影响原有系统

## 📁 文件结构

```
open-claw-gsn-skill-sharing-plugin/
├── global-skill-network.js      # 主程序文件
├── global-skill-config.json     # 配置文件
├── README.md                    # 说明文档
├── CONTRIBUTING.md               # 贡献指南
├── CODEOWNERS                   # 代码所有者
├── LICENSE                      # MIT 许可证
├── CHANGELOG.md                 # 更新日志
├── TEST-REPORT.md               # 测试报告
├── .github/                     # GitHub 配置
│   ├── ISSUE_TEMPLATE/           # Issue 模板
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   └── pull_request_template.md  # PR 模板
└── skills/                      # 技能目录
    ├── global/                  # 全球技能 (只读)
    ├── local/                   # 本地技能 (私有)
    └── backups/                 # 版本备份
```

## 🚀 快速开始

### 环境要求

- Node.js (v12 或更高版本)
- Git (用于技能同步)
- 任何支持 Node.js 的操作系统 (Windows/Linux/macOS)

### 安装步骤

1. **下载插件文件**
   ```bash
   # 将三个文件下载到同一目录
   - global-skill-network.js
   - global-skill-config.json
   - README.md
   ```

2. **确保 Git 已安装**
   ```bash
   git --version
   ```

3. **运行插件**
   ```bash
   node global-skill-network.js --help
   ```

## 📖 使用说明

### 命令行参数

#### 1. 更新全球技能 (`--update`)

**功能**: 仅从全球仓库拉取最新技能，不上传任何本地数据

```bash
node global-skill-network.js --update
```

**特点**:
- ✅ 只拉取，不上传
- ✅ 自动扫描危险代码
- ✅ 创建版本备份
- ✅ 显示更新日志

#### 2. 共享本地技能 (`--share`)

**功能**: 主动将本地技能共享到全球仓库

```bash
node global-skill-network.js --share
```

**安全流程**:
1. 显示将要共享的本地技能列表
2. 显示安全警告
3. 要求二次确认 (输入 Y)
4. 提供手动上传指导 (通过 GitHub PR)

**重要**: 此命令需要用户明确确认，不会自动上传

#### 3. 版本回退 (`--rollback`)

**功能**: 回退到之前的技能版本

```bash
node global-skill-network.js --rollback
```

**特点**:
- 显示可用备份列表
- 选择特定版本进行回退
- 保留当前版本作为备份

#### 4. 安全启动 (`--safe`)

**功能**: 以增强安全模式启动 OpenClaw

```bash
node global-skill-network.js --safe
```

**特点**:
- 显示当前安全配置
- 根据策略自动检查更新
- 启用沙箱执行环境

#### 5. 显示配置 (`--config`)

**功能**: 显示当前配置信息

```bash
node global-skill-network.js --config
```

## ⚙️ 配置说明

### global-skill-config.json

```json
{
  "version": "1.0.0",                    // 插件版本
  "lastUpdate": null,                    // 最后更新时间
  "securityLevel": "medium",             // 安全级别: low/medium/high
  "updateStrategy": "notify",            // 更新策略: auto/notify/manual/rollback
  "autoSync": false,                     // 是否自动同步
  "syncInterval": 3600000,              // 同步间隔 (毫秒)
  "sandboxEnabled": true,                // 是否启用沙箱
  "dangerousPatterns": [...],           // 危险代码模式
  "allowedDomains": [],                  // 允许的域名
  "maxFileSize": 1048576,               // 最大文件大小 (字节)
  "enableLogging": true                 // 是否启用日志
}
```

### 安全级别说明

- **low**: 基本安全检查，适合信任的环境
- **medium**: 中等安全检查，扫描常见危险代码 (默认)
- **high**: 高安全检查，严格隔离可疑代码

### 更新策略说明

- **auto**: 自动更新并应用
- **notify**: 通知有更新，手动确认 (默认)
- **manual**: 完全手动控制更新
- **rollback**: 自动回退到安全版本

## 🔐 安全特性

### 1. 危险代码扫描

插件会自动扫描所有技能文件，检测以下危险模式：

- `eval()` - 动态代码执行
- `exec()` - 命令执行
- `child_process` - 子进程操作
- 文件删除操作
- 进程终止操作
- 其他潜在危险操作

### 2. 沙箱执行环境

- 隔离技能执行环境
- 限制文件系统访问
- 控制网络请求
- 防止恶意代码传播

### 3. 版本备份系统

- 每次更新前自动创建备份
- 保留最近 10 个版本
- 支持一键回退

### 4. 二次确认机制

- 共享操作需要明确确认
- 显示详细的警告信息
- 防止误操作导致的数据泄露

## 🌍 全球技能仓库

**仓库地址**: https://github.com/OpenClaw-Global/global-skills.git

**仓库特点**:
- 只读访问，保护用户隐私
- 定期更新，提供最新技能
- 社区审核，确保代码质量
- 开源透明，可审计代码

## 🛠️ 技术特性

### 核心技术

- **Node.js 原生**: 无第三方依赖，轻量高效
- **Git 集成**: 利用 Git 进行版本控制和同步
- **跨平台**: 支持 Windows、Linux、macOS
- **后台同步**: 不卡顿的异步更新机制

### 性能优化

- 增量更新，只下载变更内容
- 后台同步，不影响主程序运行
- 智能缓存，减少重复下载
- 并发处理，提高同步速度

## 📝 使用示例

### 示例 1: 首次使用

```bash
# 1. 查看帮助
node global-skill-network.js

# 2. 更新全球技能
node global-skill-network.js --update

# 3. 安全启动
node global-skill-network.js --safe
```

### 示例 2: 共享技能

```bash
# 1. 将技能放入 skills/local/ 目录

# 2. 执行共享命令
node global-skill-network.js --share

# 3. 确认共享 (输入 Y)

# 4. 按照提示通过 GitHub PR 上传
```

### 示例 3: 版本管理

```bash
# 1. 更新技能
node global-skill-network.js --update

# 2. 发现问题，回退版本
node global-skill-network.js --rollback

# 3. 选择要回退的备份版本
```

## ⚠️ 注意事项

1. **Git 要求**: 使用前请确保 Git 已正确安装
2. **网络连接**: 更新全球技能需要网络连接
3. **权限要求**: 首次运行可能需要管理员权限
4. **备份建议**: 重要技能请手动备份
5. **安全第一**: 不要轻易运行来源不明的技能

## 🤝 贡献指南

### 如何共享技能

1. 将技能放入 `skills/local/` 目录
2. 运行 `--share` 命令
3. 按照提示通过 GitHub 创建 Pull Request
4. 等待社区审核和合并

### 代码规范

- 遵循 JavaScript 最佳实践
- 添加清晰的注释和文档
- 通过危险代码扫描
- 确保代码安全可靠

## 📄 许可证

本插件遵循 MIT 许可证，允许自由使用和修改。

## 🔗 相关链接

- **项目仓库**: https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin
- **全球技能仓库**: https://github.com/OpenClaw-Global/global-skills.git
- **国内推荐仓库**: https://gitee.com/tree-of-knowledge-zhang/open-claw-gsn-skill-sharing-plugin
- **贡献指南**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **更新日志**: [CHANGELOG.md](CHANGELOG.md)
- **测试报告**: [TEST-REPORT.md](TEST-REPORT.md)
- **许可证**: [LICENSE](LICENSE)
- **问题反馈**: https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/issues
- **社区讨论**: https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/discussions

## 📞 技术支持

如遇到问题，请：

1. 检查日志输出
2. 确认 Git 和 Node.js 版本
3. 查看配置文件设置
4. 联系技术支持团队

## 🎯 版本历史

详细的版本更新记录请查看 [CHANGELOG.md](CHANGELOG.md)

### v1.0.0 (2024-03-16)

- ✅ 初始版本发布
- ✅ 全球技能同步功能
- ✅ 三级安全系统
- ✅ 危险代码扫描
- ✅ 版本回退功能
- ✅ 完全合规设计
- ✅ 100% 测试通过率

---

**OpenClaw 全球技能共享插件 - 安全、合规、可靠**

⚠️ **重要提醒**: 本插件严格遵守用户隐私保护原则，默认只拉取全球技能，不上传任何用户本地数据。您的本地技能永远私有！