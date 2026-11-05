@echo off
setlocal
cd /d "%~dp0"
echo Teste opcional de voz para o Grimorio das Trevas.
echo Requer Python 3.10 ou mais recente, de 64 bits, instalado neste Windows.
if not exist ".venv\Scripts\python.exe" (
  where py >nul 2>nul
  if not errorlevel 1 (
    py -3 -m venv .venv
  ) else (
    python -m venv .venv
  )
  if errorlevel 1 goto erro
)
if not exist ".venv\pronto-v1.txt" (
  ".venv\Scripts\python.exe" -m pip install -r requirements.txt
  if errorlevel 1 goto erro
  echo pronto>".venv\pronto-v1.txt"
)
".venv\Scripts\python.exe" voz_trevas.py %*
if errorlevel 1 goto erro
goto fim
:erro
echo.
echo O teste de voz nao iniciou. Confira a mensagem acima.
echo As legendas e o NumPad funcionam normalmente sem este programa.
:fim
pause
endlocal
