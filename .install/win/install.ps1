$extensionsPath = "$env:APPDATA\spicetify\Extensions"

if (-not (Test-Path $extensionsPath)) {
    New-Item -ItemType Directory -Path $extensionsPath -Force | Out-Null
}

Set-Location $extensionsPath

Clear-Host
Write-Host "Welcome to the
                             __  _ ____     
  ________  __  _____  _____/ /_(_) __/_  __
 / ___/ _ \/ / / / _ \/ ___/ __/ / /_/ / / /
/ /__/  __/ /_/ /  __/ /__/ /_/ / __/ /_/ / 
\___/\___/\__, /\___/\___/\__/_/_/  \__, /  
         /____/                    /____/   installation wizard
"
Write-Host ""
Write-Host ""

$autoupdate = Read-Host "Automatically use the latest version? [Y/n]"
$chosenversion = ""

if ($autoupdate -eq "n" -or $autoupdate -eq "N") {
    if (Test-Path ".\ceyecetify_with_updates.js") {
        Write-Host "Remove 'ceyecetify_with_updates.js'..."
        Remove-Item ".\ceyecetify_with_updates.js"
        spicetify config extensions ceyecetify_with_updates.js-
    }

    Write-Host "Installing without automatic updates..."
    curl.exe -L "https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/ceyecetify_without_updates.js" -o ".\ceyecetify_without_updates.js"
    $chosenversion = "ceyecetify_without_updates.js"
}
else {
    if (Test-Path ".\ceyecetify_without_updates.js") {
        Write-Host "Remove 'ceyecetify_without_updates.js'..."
        Remove-Item ".\ceyecetify_without_updates.js"
        spicetify config extensions ceyecetify_without_updates.js-
    }
    Write-Host "Installing with automatic updates..."
    curl.exe -L "https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/ceyecetify_with_updates.js" -o ".\ceyecetify_with_updates.js"
    $chosenversion = "ceyecetify_with_updates.js"
}

Write-Host ""
Write-Host ""
$addtospicetify = Read-Host "Automatically add to Spicetify? [Y/n]"

if ($addtospicetify -ine "n") {
    Write-Host "Adding to Spicetify..."
    spicetify config extensions $chosenversion
    spicetify apply
}

Write-Host ""
Write-Host "You're done, enjoy ceyecetify!"
Write-Host "Press any key to finish the installation..."
[Console]::ReadKey($true) | Out-Null