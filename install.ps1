Set-Location "$env:APPDATA/spicetify/Extensions"

Clear-Host
Write-Host "
                                  __  .__  _____       
  ____  ____ ___.__. ____   _____/  |_|__|/ ____\__.__.
_/ ___\/ __ <   |  |/ __ \_/ ___\   __\  \   __<   |  |
\  \__\  ___/\___  \  ___/\  \___|  | |  ||  |  \___  |
 \___  >___  > ____|\___  >\___  >__| |__||__|  / ____|
     \/    \/\/         \/     \/               \/     
"
Write-Host "Welcome to the ceyectify installation wizard"
Write-Host ""
Write-Host ""
Write-Host ""

$autoupdate = Read-Host "Automatically use the latest version? [Y/n]"
$chosenversion = ""

if ($autoupdate -eq "n" -or $autoupdate -eq "N") {
    if (Test-Path ".\ceyectify_with_updates.js") {
        Write-Host "Remove 'ceyectify_with_updates.js'..."
        Remove-Item ".\ceyectify_with_updates.js"
        spicetify config extensions ceyectify_with_updates.js-
    }

    Write-Host "Installing without automatic updates..."
    curl.exe -L "https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/ceyectify_without_updates.js" -o ".\ceyectify_without_updates.js"
    $chosenversion = "ceyectify_without_updates.js"
}
else {
    if (Test-Path ".\ceyectify_without_updates.js") {
        Write-Host "Remove 'ceyectify_without_updates.js'..."
        Remove-Item ".\ceyectify_without_updates.js"
        spicetify config extensions ceyectify_without_updates.js-
    }
    Write-Host "Installing with automatic updates..."
    curl.exe -L "https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/ceyectify_with_updates.js" -o ".\ceyectify_with_updates.js"
    $chosenversion = "ceyectify_with_updates.js"
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
Write-Host "You're done, enjoy ceyectify!"
Write-Host "Press any key to finish the installation..."
[Console]::ReadKey($true) | Out-Null