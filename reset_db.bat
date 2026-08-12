@echo off
chcp 65001 >nul
title 重置数据库
cd /d "%~dp0"

echo ========================================
echo   动漫聊天室 - 数据库重置工具
echo ========================================
echo.

if not exist "data\app.db" (
    echo [提示] 未找到数据库文件，当前已经是干净状态。
    goto :end
)

echo 正在尝试删除聊天记录与朋友圈数据 (data\app.db) ...
del /f /q "data\app.db"

if exist "data\app.db" (
    echo.
    echo [错误] 删除失败！文件被系统占用。
    echo 请先关闭正在运行项目的黑色命令行窗口 (start.bat)，然后再运行本脚本。
) else (
    echo [成功] 数据库已清空！
    
    if exist "data\player.json" (
        del /f /q "data\player.json"
        echo [提示] 您的昵称设置也已一并重置。
    )
)

:end
echo.
echo 请按任意键退出，随后重新双击 start.bat 启动项目。
pause >nul