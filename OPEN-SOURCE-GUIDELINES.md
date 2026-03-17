# OpenClaw GSN 技能收集开源注意事项

## 📋 概述

本文档定义了在收集和整理技能时必须遵守的开源规范和注意事项，确保所有技能都符合开源社区的最佳实践。

## 📄 许可证要求

### 必须满足的条件

1. **明确的许可证声明**
   - 每个技能文件必须包含许可证头注释
   - 推荐使用宽松的开源许可证：MIT、Apache-2.0、BSD-3-Clause
   - 避免使用GPL等传染性许可证（除非有特殊需求）

2. **许可证示例**

```javascript
/**
 * @license MIT
 * 
 * Copyright (c) 2026 [作者名]
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
```

## 👤 版权和知识产权

### 版权标注要求

1. **作者信息**
   - 必须在技能索引中标注原作者
   - 保留原始版权声明
   - 尊重原作者的署名权

2. **知识产权保护**
   - 不收集有专利争议的代码
   - 避免使用商标保护的名称
   - 尊重第三方的知识产权

3. **衍生作品**
   - 明确标注是否为衍生作品
   - 引用原始来源
   - 遵循原许可证的衍生条款

## 🔒 安全和隐私

### 安全要求

1. **代码审查**
   - 所有技能必须通过安全扫描
   - 检测危险代码模式
   - 验证输入输出处理

2. **隐私保护**
   - 不收集用户个人信息
   - 不上传本地数据到外部服务器
   - 明确数据处理方式

3. **沙箱执行**
   - 推荐在沙箱环境中执行
   - 限制文件系统访问
   - 限制网络访问

### 禁止的内容

```javascript
// ❌ 禁止的危险代码模式
eval()              // 动态代码执行
exec()              // 命令执行
require('fs')       // 文件系统操作（除非必要）
require('child_process')  // 子进程执行
process.exit()       // 强制退出
```

## 📦 依赖管理

### 依赖要求

1. **开源依赖**
   - 所有依赖必须是开源的
   - 使用npm、yarn等包管理器
   - 明确列出所有依赖项

2. **依赖版本**
   - 锁定依赖版本
   - 定期更新依赖
   - 修复已知安全漏洞

3. **依赖声明示例**

```json
{
  "name": "my-skill",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "eslint": "^8.55.0"
  }
}
```

## 📖 文档要求

### 必需的文档

1. **README.md**
   - 技能描述和用途
   - 安装和使用方法
   - API文档和示例
   - 配置选项说明

2. **代码注释**
   - 函数和类的JSDoc注释
   - 复杂逻辑的解释
   - 参数和返回值说明

3. **示例代码**

```javascript
/**
 * 计算两个数的和
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两数之和
 * @example
 * add(2, 3); // 返回 5
 */
function add(a, b) {
    return a + b;
}
```

## 🤝 贡献指南

### 贡献流程

1. **Fork仓库**
   - 创建个人分支
   - 遵循命名规范：`feature/skill-name`

2. **代码规范**
   - 使用ESLint进行代码检查
   - 遵循项目代码风格
   - 编写单元测试

3. **Pull Request**
   - 清晰描述变更内容
   - 引用相关Issue
   - 通过所有CI检查

### 行为准则

- 尊重所有贡献者
- 建设性反馈
- 包容不同观点
- 专业沟通

## 🧪 测试要求

### 测试覆盖

1. **单元测试**
   - 测试覆盖率 > 80%
   - 测试主要功能路径
   - 包含边界情况

2. **集成测试**
   - 测试与其他技能的集成
   - 验证API兼容性
   - 测试错误处理

3. **测试示例**

```javascript
describe('Calculator', () => {
    test('should add two numbers', () => {
        expect(calculator.add(2, 3)).toBe(5);
    });

    test('should handle division by zero', () => {
        expect(() => calculator.divide(10, 0)).toThrow();
    });
});
```

## 📊 版本控制

### 语义化版本

遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/)：

- **MAJOR**：不兼容的API变更
- **MINOR**：向后兼容的功能新增
- **PATCH**：向后兼容的问题修复

### CHANGELOG维护

```markdown
## [1.2.0] - 2026-03-17

### Added
- 新增乘法运算功能

### Changed
- 优化除法运算性能

### Fixed
- 修复负数计算错误
```

## 🔍 代码审查清单

### 提交前检查

- [ ] 代码包含许可证头
- [ ] 作者信息正确标注
- [ ] 通过ESLint检查
- [ ] 通过安全扫描
- [ ] 包含单元测试
- [ ] 测试覆盖率达标
- [ ] 文档完整
- [ ] CHANGELOG已更新
- [ ] 依赖已更新
- [ ] 无已知安全漏洞

## 🚫 禁止事项

### 严禁收集的内容

1. **恶意代码**
   - 病毒、木马、后门
   - 挖矿脚本
   - 数据窃取代码

2. **非法内容**
   - 侵犯版权的代码
   - 逆向工程工具
   - 破解工具

3. **危险操作**
   - 未授权的系统访问
   - 数据篡改
   - 拒绝服务攻击

## ✅ 合规检查

### 必须通过的检查

1. **许可证检查**
   - 许可证是否明确
   - 是否符合开源定义
   - 是否允许商业使用

2. **安全检查**
   - 是否包含危险代码
   - 是否有安全漏洞
   - 是否保护用户隐私

3. **质量检查**
   - 代码是否可读
   - 是否有适当注释
   - 是否经过测试

## 📞 联系方式

如有疑问或需要帮助，请联系：

- **GitHub Issues**: https://github.com/8zhangshulun/open-claw-gsn-skill-sharing-plugin/issues
- **Email**: 通过GitHub联系
- **文档**: 查看项目README和CONTRIBUTING.md

## 📚 参考资料

- [开源定义](https://opensource.org/osd)
- [MIT许可证](https://opensource.org/licenses/MIT)
- [Apache 2.0许可证](https://opensource.org/licenses/Apache-2.0)
- [语义化版本](https://semver.org)
- [贡献者契约](https://www.contributor-covenant.org/zh-cn/version/2/0/code_of_conduct/)

---

**最后更新**: 2026-03-17
**版本**: 1.0.0