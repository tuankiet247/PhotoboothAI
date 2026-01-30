@echo off
REM Script tạo chứng chỉ tự ký cho localhost (chỉ dùng cho phát triển)
set CERT_NAME=localhost
set CERT_KEY=localhost-key.pem
set CERT_CRT=localhost-cert.pem

if exist %CERT_KEY% (
    echo File %CERT_KEY% đã tồn tại.
) else (
    openssl req -x509 -out %CERT_CRT% -keyout %CERT_KEY% -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost" -days 3650
    echo Đã tạo xong chứng chỉ tự ký: %CERT_KEY% và %CERT_CRT%
)

pause
