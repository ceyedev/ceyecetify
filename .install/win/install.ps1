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

foreach ($file in @("ceyecetify_with_updates.js", "ceyecetify_without_updates.js")) {
    if (Test-Path ".\$file") {
        Write-Host "Remove '$file'..."
        Remove-Item ".\$file"
        spicetify config extensions "$file-"
    }
}

if ($autoupdate -eq "n" -or $autoupdate -eq "N") {
    Write-Host "Installing without automatic updates..."
    curl.exe -L "https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/ceyecetify_without_updates.js" -o ".\ceyecetify_without_updates.js"
    $chosenversion = "ceyecetify_without_updates.js"
}
else {
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