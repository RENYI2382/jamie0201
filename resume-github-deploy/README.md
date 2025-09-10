# 任毅 - 个人简历网站

## 目录结构

```
resume-github-deploy/
├── index.html                 # 主页面文件
├── README.md                  # 项目说明文档
├── .gitignore                # Git忽略文件配置
├── assets/                   # 静态资源目录
│   ├── css/                  # CSS样式文件（预留）
│   └── js/                   # JavaScript文件（预留）
└── images/                   # 图片资源目录
    ├── personal/             # 个人照片
    │   └── 个人照片.jpg
    └── projects/             # 项目相关图片
        ├── tsinghua-urban-cup/   # 清华大学Urban Cup项目
        │   ├── 参会照片1.jpg
        │   ├── 项目数据分析可视化.jpg
        │   └── 项目运行过程.jpg
        └── acco-project/         # ACCO友佳陪诊项目
            ├── ACCO友佳陪诊——老年就医陪护新选择（PPT）-01.png
            ├── ACCO友佳陪诊——老年就医陪护新选择（PPT）-05.png
            ├── ACCO友佳陪诊——老年就医陪护新选择（PPT）-10.png
            ├── ACCO友佳陪诊——老年就医陪护新选择（PPT）-15.png
            └── ACCO友佳陪诊——老年就医陪护新选择（PPT）-20.png
```

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js (需要安装http-server)
npx http-server

# 使用PHP
php -S localhost:8000
```

## 技术栈

- **HTML5**: 语义化标签，良好的SEO支持
- **CSS3**: 
  - CSS变量 (Custom Properties)
  - Flexbox 和 Grid 布局
  - 响应式媒体查询
  - CSS动画和过渡效果
- **JavaScript**: 原生JS实现图片轮播功能
- **Font Awesome**: 图标库 (CDN引入)

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 自定义修改

### 修改个人信息

编辑 `index.html` 文件中的以下部分：

- 第6行：修改页面标题
- 第717行：更换个人头像
- 第722-730行：修改联系方式
- 第704-715行：修改个人介绍文本

### 添加新项目

1. 在 `images/projects/` 下创建新的项目文件夹
2. 上传项目相关图片
3. 在 `index.html` 中添加新的项目卡片
4. 参考现有项目的HTML结构

### 修改样式

所有样式都在 `index.html` 的 `<style>` 标签内，可以直接修改：

- CSS变量定义在 `:root` 选择器中
- 响应式断点在 `@media` 查询中
- 各组件样式按功能模块组织

## 联系方式

- 邮箱：reny0201@163.com
- 电话：15360566126

## 许可证

此项目仅供个人使用，请勿用于商业用途。
