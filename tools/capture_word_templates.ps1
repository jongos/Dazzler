param([Parameter(Mandatory=$true)][string]$Output, [string]$Source)
$ErrorActionPreference='Stop'
$templateSource=Join-Path (Split-Path $PSScriptRoot -Parent) 'skills/dazzler-frontend/assets/templates/docx'
if ($Source) { $templateSource=[IO.Path]::GetFullPath($Source) }
$templateOutput=[IO.Path]::GetFullPath($Output)
New-Item -ItemType Directory -Path $templateOutput -Force | Out-Null
$templateWord=New-Object -ComObject Word.Application
$templateWord.Visible=$false
$templateWord.DisplayAlerts=0
try {
    foreach ($templateFile in Get-ChildItem -LiteralPath $templateSource -Filter '*.docx') {
        $templateDocument=$null
        try {
            $templateDocument=$templateWord.Documents.Open($templateFile.FullName,$false,$true,$false)
            $templateDocument.ExportAsFixedFormat((Join-Path $templateOutput ($templateFile.BaseName+'.pdf')),17)
            Write-Output ($templateFile.Name+' rendered')
        } finally {
            if ($null -ne $templateDocument) {
                $templateDocument.Close(0)
                [void][Runtime.InteropServices.Marshal]::ReleaseComObject($templateDocument)
            }
        }
    }
} finally {
    $templateWord.Quit()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($templateWord)
}
