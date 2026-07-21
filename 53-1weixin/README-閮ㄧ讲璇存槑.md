# GitHub Pages 部署说明

这是可直接部署的静态网页，不需要安装 Node.js，也不需要运行构建命令。

## 上传方法

1. 先在电脑上解压 `agri-tech-forum-github-pages.zip`。
2. 打开你的 GitHub 仓库，选择 **Add file → Upload files**。
3. 上传解压后的全部内容，必须确保 `index.html` 位于仓库最外层，不能只上传压缩包。
4. 打开仓库 **Settings → Pages**。
5. 在 **Build and deployment** 中选择 **Deploy from a branch**。
6. Branch 选择 `main`，目录选择 `/(root)`，点击 **Save**。
7. 等待约一至三分钟，再打开 GitHub Pages 地址。

正确的仓库文件结构应为：

```text
index.html
styles.css
script.js
assets/
  avatars/
README-部署说明.md
```

如果网页仍显示旧内容，请按 `Ctrl + F5` 强制刷新浏览器缓存。
