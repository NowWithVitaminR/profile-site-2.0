
param(
    [string]$RootPath = ".\public\images",
    [string]$thumbFolderName = "thumbnails"
)
Add-Type -Assembly System.Drawing
# Function to create thumbnails
function CreateThumbnails {
    param(
        [string]$FolderPath
    )

    # Supported image extensions
    $imageExtensions = @(".jpg", ".jpeg", ".png", ".bmp", ".gif")

    # Get all image files in the folder
    $images = Get-ChildItem -Path $FolderPath -File | Where-Object { $_.Extension -in $imageExtensions }

    if ($images.Count -gt 0) {
        # Create the Thumbnails folder if it doesn't exist
        $thumbnailFolder = Join-Path -Path $FolderPath -ChildPath $thumbFolderName
        if (-not (Test-Path -Path $thumbnailFolder)) {
            New-Item -ItemType Directory -Path $thumbnailFolder | Out-Null
        }

        foreach ($image in $images) {
            $thumbnailPath = Join-Path -Path $thumbnailFolder -ChildPath $image.Name

            # Only create the thumbnail if it does not already exist
            if (-not (Test-Path -Path $thumbnailPath)) {
                try {
                    # Load the image
                    $img = [System.Drawing.Image]::FromFile($image.FullName)

                    # Calculate the new dimensions
                    $scaleFactor = 100 / $img.Height
                    $newWidth = [int]($img.Width * $scaleFactor)
                    $newHeight = 100

                    # Create a new bitmap with the scaled dimensions
                    $thumbnail = New-Object System.Drawing.Bitmap $newWidth, $newHeight

                    # Draw the scaled image onto the bitmap
                    $graphics = [System.Drawing.Graphics]::FromImage($thumbnail)
                    $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)

                    # Save the thumbnail
                    $thumbnail.Save($thumbnailPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

                    # Dispose objects to free resources
                    $graphics.Dispose()
                    $thumbnail.Dispose()
                    $img.Dispose()

                    Write-Host "Created thumbnail for $($image.FullName)"
                }
                catch {
                    Write-Host "Failed to create thumbnail for $($image.FullName): $_" -ForegroundColor Red
                }
            }
        }

        # Remove orphan thumbnails
        $thumbnails = Get-ChildItem -Path $thumbnailFolder -File
        foreach ($thumbnail in $thumbnails) {
            $originalImagePath = Join-Path -Path $FolderPath -ChildPath $thumbnail.Name
            if (-not (Test-Path -Path $originalImagePath)) {
                Remove-Item -Path $thumbnail.FullName -Force
                Write-Host "Deleted orphan thumbnail: $($thumbnail.FullName)"
            }
        }
    }
}

# Scan directories and process images
Get-ChildItem -Path $RootPath -Recurse -Directory | Where-Object { $_.Name -ne $thumbFolderName } | ForEach-Object {
    CreateThumbnails -FolderPath $_.FullName
}
