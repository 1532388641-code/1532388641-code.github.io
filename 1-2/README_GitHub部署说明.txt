江城大学校园论坛｜GitHub Pages 适配版
==========================================

这版已修复：
1. 新首页 HTML 与旧 CSS 缓存不同步导致的排版失效。
2. 使用全新样式文件 forum-mobile-v4.css，强制浏览器和 GitHub CDN 拉取新版本。
3. index.html 与 scene.html 内置关键手机样式，即使外部 CSS 暂时未刷新，首页也不会变成纯文字。
4. 页面路径全部使用 ./ 相对路径，适配 GitHub 项目子目录。
5. 已加入 .nojekyll。
6. 手机宽度下铺满屏幕，电脑打开时保持手机竖屏预览宽度。
7. 不自动滚动。

上传 GitHub：
- 请把本文件夹里面的所有文件直接上传到仓库根目录。
- 仓库根目录必须能直接看到 index.html、thread.html、assets 文件夹和 .nojekyll。
- 不要只上传 index.html，也不要漏掉 assets 文件夹。
- GitHub Pages 保存后等待约 1 分钟，再强制刷新页面：
  Windows：Ctrl + F5
  手机：关闭网页标签后重新打开，或清除该网站缓存。

默认访问：
- 仓库 Pages 地址会直接打开 index.html。
