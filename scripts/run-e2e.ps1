$ErrorActionPreference = 'Stop'
$server = Start-Process -FilePath 'node.exe' -ArgumentList 'node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3101' -WorkingDirectory $PSScriptRoot\.. -PassThru -WindowStyle Hidden

try {
  $ready = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:3101/' -TimeoutSec 2
      if ($response.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
  }
  if (-not $ready) { throw 'E2E server did not become ready on port 3101.' }
  & bunx playwright test
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  if (-not $server.HasExited) { Stop-Process -Id $server.Id -Force }
}
