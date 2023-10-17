@echo off
start http://localhost:3000/%~n1%~x1
cmd /k "node server.js"

