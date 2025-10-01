# Prisma Regeneration Script for Windows
Write-Host "🔧 Fixing Prisma Lock Issue..." -ForegroundColor Cyan

# Stop all node processes
Write-Host "⏹️  Stopping Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Remove .prisma folder
Write-Host "🗑️  Removing old Prisma client..." -ForegroundColor Yellow
Remove-Item -Path "..\..\node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Generate Prisma client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Green
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma client generated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next step: Run migration" -ForegroundColor Cyan
    Write-Host "   npx prisma migrate dev --name add_product_variants" -ForegroundColor White
} else {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    Write-Host "   Please close VS Code and try again" -ForegroundColor Yellow
}

