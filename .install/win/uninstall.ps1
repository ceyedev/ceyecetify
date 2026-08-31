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
         /____/                    /____/   uninstallation wizard
"
Write-Host ""
Write-Host ""

$uninstall = Read-Host "Proceed with the uninstallation? [Y/n]"

if ($uninstall -ine "n") {
    $needapply = $false

    if (Test-Path ".\ceyecetify_without_updates.js") {
        Write-Host "Remove 'ceyecetify_without_updates.js'..."
        Remove-Item ".\ceyecetify_without_updates.js"
        spicetify config extensions ceyecetify_without_updates.js-
        $needapply = $true
    }

    if (Test-Path ".\ceyecetify_with_updates.js") {
        Write-Host "Remove 'ceyecetify_with_updates.js'..."
        Remove-Item ".\ceyecetify_with_updates.js"
        spicetify config extensions ceyecetify_with_updates.js-
        $needapply = $true
    }

    if ($needapply) {
        spicetify apply
    }
}

Write-Host ""
Write-Host "Remaining Extensions:"
Get-ChildItem

Write-Host ""
Write-Host "You're done, enjoy the normal Spotify"
Write-Host "Press any key to finish the uninstallation..."
[Console]::ReadKey($true) | Out-Null