@echo off
chcp 65001 >nul
echo 正在启动江城大学校园论坛...
echo 浏览器访问：http://127.0.0.1:8080/scene.html
start http://127.0.0.1:8080/scene.html
python -m http.server 8080
pause
