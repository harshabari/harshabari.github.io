@echo off
title Push Portfolio to GitHub - Harshal Bari
cd /d "%~dp0"

:: Ensure Git is in PATH
set "PATH=C:\Users\ASUS\AppData\Local\Programs\Git\cmd;C:\Program Files\Git\cmd;%PATH%"

echo =======================================================
echo   PUSHING HARSHAL BARI CAD PORTFOLIO TO GITHUB
echo =======================================================
echo.

git --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Git is not found!
    pause
    exit /b 1
)

echo.
echo Pushing branch 'main' to https://github.com/harshabari/harshabari.github.io.git ...
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo =======================================================
    echo   SUCCESS! All changes pushed to GitHub!
    echo   Repository: https://github.com/harshabari/harshabari.github.io
    echo =======================================================
) else (
    echo =======================================================
    echo   If GitHub asked for login, please authorize it.
    echo =======================================================
)
echo.
pause
