# 📸 项目图片使用指南

本文档说明如何在项目中正确添加和管理图片，确保在GitHub中正常显示。

## 📁 文件夹结构

```
GDUT_Schedule_Management_Plug-in_Outlook/
├── README.md
├── docs/
│   ├── images/              # 文档相关图片
│   │   ├── architecture.png # 系统架构图
│   │   ├── workflow.png     # 工作流程图
│   │   └── ...
│   └── IMAGE_GUIDE.md       # 本文档
├── assets/                  # 项目资源文件
│   ├── logo.png            # 项目Logo
│   ├── icons/              # 图标文件
│   └── ...
└── screenshots/            # 功能截图
    ├── demo.gif           # 演示动图
    ├── interface.png      # 界面截图
    └── ...
```

## 🎯 Markdown图片语法

### 1. 基本语法
```markdown
![图片描述](图片路径)
```

### 2. 相对路径（推荐）
```markdown
![项目Logo](./assets/logo.png)
![架构图](./docs/images/architecture.png)
![演示](./screenshots/demo.gif)
```

### 3. 带链接的图片
```markdown
[![图片描述](./images/demo.png)](https://your-demo-link.com)
```

## 🎨 高级显示技巧

### 1. 居中显示
```markdown
<div align="center">
  <img src="./assets/logo.png" alt="项目Logo" width="200">
</div>
```

### 2. 控制图片大小
```markdown
<img src="./images/screenshot.png" alt="截图" width="600" height="400">
```

### 3. 并排显示
```markdown
<div align="center">
  <img src="./images/before.png" alt="优化前" width="45%">
  <img src="./images/after.png" alt="优化后" width="45%">
</div>
```

### 4. 添加图片说明
```markdown
<div align="center">
  <img src="./screenshots/demo.gif" alt="功能演示" width="600">
  <p><em>插件功能演示动图</em></p>
</div>
```

## 📋 图片规范

### 文件命名
- 使用小写字母和连字符：`system-architecture.png`
- 避免空格和特殊字符
- 使用描述性名称：`login-interface.png` 而不是 `image1.png`

### 文件格式
- **PNG**：适用于截图、图标、透明背景图片
- **JPG**：适用于照片、复杂图像
- **GIF**：适用于动画演示
- **SVG**：适用于矢量图标、简单图形

### 文件大小
- 截图：建议不超过 1MB
- Logo/图标：建议不超过 100KB
- 动图：建议不超过 5MB

## 🔧 实用工具

### 图片压缩
- [TinyPNG](https://tinypng.com/) - PNG/JPG压缩
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG优化

### 截图工具
- Windows：Snipping Tool、Snagit
- 浏览器：开发者工具截图功能

### GIF制作
- [ScreenToGif](https://www.screentogif.com/)
- [LICEcap](https://www.cockos.com/licecap/)

## ✅ 检查清单

在添加图片前，请确认：

- [ ] 图片文件已放置在正确的文件夹中
- [ ] 使用了相对路径引用
- [ ] 添加了有意义的alt文本
- [ ] 图片大小适中（文件大小和显示尺寸）
- [ ] 在GitHub上预览确认显示正常

## 🚨 常见问题

### Q: 图片在本地显示正常，但在GitHub上不显示？
A: 检查路径是否正确，确保使用相对路径，文件名大小写匹配。

### Q: 如何让图片在不同设备上都显示良好？
A: 使用响应式宽度设置，如 `width="80%"` 或设置最大宽度。

### Q: 动图文件太大怎么办？
A: 减少帧数、降低分辨率，或使用专门的GIF压缩工具。

---

💡 **提示**：定期检查图片链接的有效性，确保项目文档的完整性。