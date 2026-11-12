[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$CertificateProfile,

    [string]$TizenCliPath = "tizen"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$AppDir = Join-Path $RepoRoot "tizen-app"
$BuildDir = Join-Path $AppDir ".buildResult"
$DistDir = Join-Path $RepoRoot "dist"
$ExpectedConfig = Join-Path $AppDir "config.xml"

if (-not (Test-Path $ExpectedConfig)) {
    throw "Tizen app manifest not found: $ExpectedConfig"
}

$TizenCommand = Get-Command $TizenCliPath -ErrorAction SilentlyContinue
if (-not $TizenCommand -and -not (Test-Path $TizenCliPath)) {
    throw "Tizen CLI not found. Install Samsung TV SDK/Tizen Studio or pass -TizenCliPath."
}

if (Test-Path $BuildDir) { Remove-Item $BuildDir -Recurse -Force }
if (-not (Test-Path $DistDir)) { New-Item -ItemType Directory -Path $DistDir | Out-Null }

Push-Location $AppDir
try {
    Write-Host "Building Tizen Web App..."
    & $TizenCliPath build-web -- .
    if ($LASTEXITCODE -ne 0) { throw "tizen build-web failed with exit code $LASTEXITCODE" }

    if (-not (Test-Path $BuildDir)) {
        throw "Expected build output not found: $BuildDir"
    }

    Write-Host "Packaging and signing WGT with certificate profile '$CertificateProfile'..."
    & $TizenCliPath package -t wgt -s $CertificateProfile -o $DistDir -- $BuildDir
    if ($LASTEXITCODE -ne 0) { throw "tizen package failed with exit code $LASTEXITCODE" }

    $Wgt = Get-ChildItem -Path $DistDir -Filter "*.wgt" -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $Wgt) { throw "Tizen CLI returned success but no .wgt file was found in $DistDir" }

    $Target = Join-Path $DistDir "KaraokeTV.wgt"
    if ($Wgt.FullName -ne $Target) {
        if (Test-Path $Target) { Remove-Item $Target -Force }
        Move-Item -Path $Wgt.FullName -Destination $Target
    }

    Write-Host ""
    Write-Host "WGT created: $Target"
    Write-Host "Next: attach this signed WGT to a GitHub Release and install it with TizenBrew Installer."
}
finally {
    Pop-Location
}
