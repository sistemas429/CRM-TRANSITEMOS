@echo off
REM Backup diario de la base de datos del CRM Transitemos
set BACKUP_DIR=C:\Backups\crm_transitemos
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
set STAMP=%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%
set STAMP=%STAMP: =0%
docker exec crm_postgres pg_dump -U crm_user crm_db > "%BACKUP_DIR%\crm_db_%STAMP%.sql"
echo Backup guardado en %BACKUP_DIR%\crm_db_%STAMP%.sql
