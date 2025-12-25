@echo off
title Tool
cd /d "%~dp0"
node --max-old-space-size=8192 --expose-gc main.js
pause