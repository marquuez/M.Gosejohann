@echo off

git add .

timeout /t 3 /nobreak >nul

git commit -m "new"

timeout /t 1 /nobreak >nul

git push

timeout /t 3 /nobreak >nul

gh pr create ^
  --title "New Changes" ^
  --body "Automatisch erstellt"

echo Fertig.