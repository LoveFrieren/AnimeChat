@echo off
chcp 65001 >nul
title 动漫聊天室
cd /d "%~dp0"

set PY=%~dp0runtime\python\python.exe

if not exist "%PY%" (
    echo [错误] 未找到内置 Python 环境，请先运行 make_pack.bat 构建。
    pause & exit /b 1
)

if not exist .env (
    copy .env.example .env >nul
    echo ======================================================
    echo   已生成 .env，请填写 LLM_API_KEY 后保存，再重新运行本脚本
    echo ======================================================
    notepad .env
    exit /b 0
)

echo 正在启动服务...
"%PY%" -m backend.main
pause