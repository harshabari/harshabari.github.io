@echo off
echo ===================================================
echo   Harshal Bari Portfolio - Pushing to GitHub
echo ===================================================
echo.
cd /d "C:\Users\ASUS\Downloads\Portfalio"
set "PATH=C:\Users\ASUS\AppData\Local\Programs\Git\cmd;%PATH%"

echo Running git push to https://github.com/harshabari/harshabari.git ...
echo.
git push -u origin main

echo.
echo ===================================================
echo Execution finished. Press any key to close.
echo ===================================================
pause
