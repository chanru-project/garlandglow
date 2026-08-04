$connection = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($connection) {
  $pid5000 = $connection.OwningProcess
  Write-Host "Port 5000 is in use by PID $pid5000. Stopping old process..."
  Stop-Process -Id $pid5000 -Force
}

Set-Location $PSScriptRoot\..
node server.js
