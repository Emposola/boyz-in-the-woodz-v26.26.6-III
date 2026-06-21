# upload-to-supabase.ps1
# Run this after images are downloaded to upload to Supabase

$supabaseUrl = "https://pgwcfazhwuzxcqbqbjat.supabase.co"
$supabaseKey = "sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI"

Write-Host "Uploading images to Supabase Storage..." -ForegroundColor Cyan

# This requires the Supabase CLI or you can use the web interface
# For now, images are saved locally. You can upload them via:
# 1. Supabase Dashboard -> Storage -> Create bucket 'public-assets'
# 2. Upload all images manually
# 3. Or use the Supabase CLI: npx supabase storage upload public-assets ./downloaded-images

Write-Host "
Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to Supabase Dashboard -> Storage" -ForegroundColor White
Write-Host "2. Create a bucket called 'public-assets' (public)" -ForegroundColor White
Write-Host "3. Upload the contents of './downloaded-images' to the bucket" -ForegroundColor White
Write-Host "4. Update your database with the new public URLs" -ForegroundColor White
