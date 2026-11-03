@echo off
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (
    python ABRIR_EDITOR.py
) else (
    py -3 ABRIR_EDITOR.py
)
if errorlevel 1 (
    echo Instale Python 3 para abrir o editor local.
    pause
)
