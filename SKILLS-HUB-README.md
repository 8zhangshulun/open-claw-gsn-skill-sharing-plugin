# OpenClaw GSN 技能仓库

> 一个开放、安全、可扩展的技能共享平台，让用户可以轻松调用各种实用技能

## 📖 简介

OpenClaw GSN (Global Skill Network) 技能仓库是一个集中管理各种实用技能的平台。通过这个仓库，用户可以：

- 📦 **发现技能** - 浏览226+个经过验证的实用技能
- 🔧 **调用技能** - 通过简单的API调用使用技能
- 🤝 **共享技能** - 分享自己开发的技能给社区
- 🛡️ **安全可靠** - 所有技能都经过安全扫描和验证

## 🚀 快速开始

### 安装插件

```bash
# 克隆仓库
git clone https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin.git

# 进入目录
cd open-claw-gsn-skill-sharing-plugin

# 运行插件
node global-skill-network.js --update
```

### 查看可用技能

```bash
# 列出所有技能
node global-skill-network.js --list

# 搜索特定技能
node global-skill-network.js --search "calculator"
```

### 调用技能

```javascript
// 在代码中调用技能
const GSN = require('./global-skill-network.js');

// 初始化
const gsn = new GSN();

// 调用技能
const result = await gsn.callSkill('calculator', {
  operation: 'add',
  a: 10,
  b: 20
});

console.log(result); // { success: true, data: 30 }
```

## 📚 技能分类

技能仓库包含以下8个主要类别：

### 🔧 工具类 (150个技能)
- 基础工具：问候、计算器、文本处理、日期处理
- 数据处理：JSON工具、文件操作、日志记录、数据验证
- 字符串/数组/对象：各种数据结构操作工具
- 网络工具：URL解析、API客户端、WebSocket
- 媒体处理：图像、音频、视频、PDF、Excel处理
- 通知工具：邮件、短信、推送通知
- 系统工具：缓存、监控、备份、调度
- 并发工具：队列、工作池、事件发射器
- 性能工具：压缩、序列化、编码、哈希
- 开发工具：调试、测试、CLI助手

### 🔒 安全类 (8个技能)
- 加密工具：哈希、对称加密
- 安全扫描：代码漏洞检测
- 数据清理：输入消毒和验证
- 代码保护：混淆和压缩

### 💾 数据库类 (15个技能)
- 数据库连接：多种数据库支持
- 查询构建：SQL查询生成器
- ORM工具：对象关系映射
- 迁移工具：数据库版本管理
- 事务管理：分布式事务、Saga、CQRS
- 事件溯源：事件驱动架构

### 🌐 网络类 (12个技能)
- HTTP客户端：REST API调用
- GraphQL客户端：GraphQL查询
- gRPC客户端：远程过程调用
- WebSocket：实时通信
- P2P网络：点对点通信
- 服务发现：微服务注册与发现
- 负载均衡：流量分发策略
- API网关：API管理和路由

### 🎨 UI类 (25个技能)
- 基础组件：按钮、表单、模态框
- 数据展示：表格、树形、图表
- 交互组件：拖放、无限滚动、虚拟滚动
- 工具组件：提示框、下拉菜单、自动完成
- 系统组件：通知、主题、右键菜单
- 响应式：移动端适配、断点管理
- 无障碍：辅助功能支持

### 🧮 算法类 (10个技能)
- 排序算法：快速排序、归并排序等
- 搜索算法：二分搜索、深度优先等
- 图算法：最短路径、最小生成树
- 树算法：遍历、查找、平衡
- 字符串算法：匹配、替换、编辑距离
- 数字算法：质数、因数、最大公约数
- 几何算法：点、线、面计算
- 加密算法：RSA、AES、SHA
- 压缩算法：Huffman、LZW、Deflate

### 🧪 测试类 (3个技能)
- 单元测试：断言和测试框架
- 集成测试：端到端测试
- 性能测试：负载和压力测试

### 🚀 DevOps类 (3个技能)
- CI/CD：持续集成和部署
- 自动化：脚本和工作流
- 监控：日志、指标、告警

## 📖 技能索引

完整的技能列表请查看 [skills-index.json](skills-index.json)

### 示例技能

#### 1. 计算器 (calculator)
```javascript
{
  "id": "calculator",
  "name": "计算器",
  "description": "基础数学计算功能，支持加减乘除和复杂运算",
  "version": "1.0.0",
  "author": "8zhangshulun",
  "category": "utility",
  "tags": ["math", "calculation"],
  "file": "skills/utility/calculator.js",
  "safe": true,
  "verified": true
}
```

#### 2. 文本处理器 (text-processor)
```javascript
{
  "id": "text-processor",
  "name": "文本处理器",
  "description": "文本处理工具，包括大小写转换、去除空格、字符串分割等",
  "version": "1.0.0",
  "author": "8zhangshulun",
  "category": "utility",
  "tags": ["text", "string", "processing"],
  "file": "skills/utility/text-processor.js",
  "safe": true,
  "verified": true
}
```

#### 3. 加密工具 (crypto-tools)
```javascript
{
  "id": "crypto-tools",
  "name": "加密工具",
  "description": "基础加密解密工具，包括哈希、对称加密等",
  "version": "1.0.0",
  "author": "8zhangshulun",
  "category": "security",
  "tags": ["crypto", "hash", "encryption"],
  "file": "skills/security/crypto-tools.js",
  "safe": true,
  "verified": true
}
```

## 🔧 使用方法

### 命令行使用

```bash
# 更新技能库
node global-skill-network.js --update

# 共享本地技能
node global-skill-network.js --share skills/local/my-skill.js

# 回滚版本
node global-skill-network.js --rollback my-skill 1.0.0

# 安全启动
node global-skill-network.js --safe

# 查看配置
node global-skill-network.js --config
```

### 编程接口

```javascript
const GSN = require('./global-skill-network.js');

// 创建实例
const gsn = new GSN();

// 更新技能库
await gsn.updateGlobalSkills();

// 调用技能
const result = await gsn.callSkill('calculator', {
  operation: 'add',
  a: 10,
  b: 20
});

// 共享技能
await gsn.shareLocalSkill('skills/local/my-skill.js');

// 扫描危险代码
const scanResult = await gsn.scanDangerousCode('skills/local/my-skill.js');
```

## 🛡️ 安全特性

### 三级安全等级

- **低级 (low)** - 基础安全检查
- **中级 (medium)** - 推荐设置，包含危险代码扫描
- **高级 (high)** - 严格安全检查，沙箱执行

### 危险代码检测

自动检测以下危险模式：
- `eval()` 和 `Function()` 执行
- 文件系统操作
- 网络请求
- 子进程执行
- 系统命令执行
- 敏感信息访问

### 沙箱执行

可选的沙箱环境，隔离技能执行：
- 限制文件系统访问
- 限制网络访问
- 限制系统资源使用
- 隔离执行环境

## 📊 统计信息

- **总技能数**: 226
- **已验证技能**: 226
- **安全技能**: 226
- **技能分类**: 8
- **最后更新**: 2026-03-17

## 🤝 贡献指南

欢迎贡献新的技能！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingSkill`)
3. 提交更改 (`git commit -m 'Add some AmazingSkill'`)
4. 推送到分支 (`git push origin feature/AmazingSkill`)
5. 开启 Pull Request

详细的贡献指南请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔗 相关链接

- [GitHub 仓库](https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin)
- [问题反馈](https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/issues)
- [功能请求](https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/issues)
- [更新日志](CHANGELOG.md)

## 📧 联系方式

- 作者: 8zhangshulun
- 邮箱: [通过 GitHub 联系](https://github.com/8zhangshulun)

## 🙏 致谢

感谢所有贡献者和使用者的支持！

---

**注意**: 本项目仍在积极开发中，欢迎提供反馈和建议。