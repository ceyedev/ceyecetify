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
Write-Host "Welcome to the ceyectify uninstallation wizard"
Write-Host ""
Write-Host ""
Write-Host ""
$uninstall = Read-Host "Proceed with the uninstallation? [Y/n]"

if ($uninstall -ine "n") {
    if (Test-Path ".\ceyectify_without_updates.js") {
        Write-Host "Remove 'ceyectify_without_updates.js'..."
        Remove-Item ".\ceyectify_without_updates.js"
        spicetify config extensions ceyectify_without_updates.js-
    }

    if (Test-Path ".\ceyectify_with_updates.js") {
        Write-Host "Remove 'ceyectify_with_updates.js'..."
        Remove-Item ".\ceyectify_with_updates.js"
        spicetify config extensions ceyectify_with_updates.js-
    }
}

Write-Host ""
Write-Host "You're done, enjoy the normal Spotify"
Write-Host "Press any key to finish the uninstallation..."
[Console]::ReadKey($true) | Out-Null