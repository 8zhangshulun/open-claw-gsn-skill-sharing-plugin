# 贡献指南

感谢你对 OpenClaw 全球技能共享插件的关注！我们欢迎任何形式的贡献。

## 🤝 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 检查 [Issues](https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/issues) 确认问题未被报告
2. 使用我们的 Issue 模板创建新问题
3. 提供详细的信息，包括：
   - 问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（操作系统、Node.js 版本等）

### 提交代码

我们欢迎代码贡献！请遵循以下步骤：

#### 1. Fork 仓库

点击 GitHub 页面右上角的 "Fork" 按钮

#### 2. 克隆你的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/open-claw-gsn-skill-sharing-plugin.git
cd open-claw-gsn-skill-sharing-plugin
```

#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
```

#### 4. 进行更改

- 遵循现有的代码风格
- 添加必要的注释
- 确保代码通过测试
- 更新相关文档

#### 5. 提交更改

```bash
git add .
git commit -m "Add your feature"
```

提交信息格式：
```
类型(范围): 简短描述

详细说明（可选）

类型可以是：
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关
```

#### 6. 推送到你的 Fork

```bash
git push origin feature/your-feature-name
```

#### 7. 创建 Pull Request

1. 访问原仓库
2. 点击 "New Pull Request"
3. 选择你的分支
4. 填写 PR 模板
5. 等待代码审查

## 📋 代码规范

### JavaScript 规范

- 使用 4 空格缩进
- 使用单引号
- 函数名使用驼峰命名
- 常量使用大写下划线命名
- 添加 JSDoc 注释

### 安全规范

**重要**: 本项目必须严格遵守安全原则：

- ✅ 默认只拉取，不上传
- ✅ 本地技能永远私有
- ✅ 共享必须二次确认
- ✅ 不收集用户数据
- ✅ 不修改核心代码
- ✅ 所有代码必须通过安全扫描

### 测试规范

- 为新功能添加测试
- 确保所有测试通过
- 测试覆盖率不低于 80%

## 🔍 代码审查

所有 Pull Request 都需要经过代码审查：

1. 至少一位维护者批准
2. 通过所有 CI 检查
3. 解决所有审查意见
4. 保持提交历史清晰

## 📝 文档

- 更新 README.md
- 添加 API 文档
- 提供使用示例
- 更新 CHANGELOG.md

## 🎯 优先级

我们关注以下类型的贡献：

- 🔴 高优先级：安全漏洞、严重 bug
- 🟡 中优先级：新功能、性能优化
- 🟢 低优先级：文档改进、代码清理

## 📧 联系方式

- GitHub Issues: https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/issues
- Discussions: https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/discussions

## 📄 许可证

通过贡献代码，你同意你的贡献将根据项目的 MIT 许可证进行许可。

## 🙏 致谢

感谢所有贡献者！你的贡献让这个项目变得更好。

---

**开始贡献吧！我们期待你的 PR！** 🚀