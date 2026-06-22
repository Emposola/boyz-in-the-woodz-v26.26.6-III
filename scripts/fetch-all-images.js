import { createClient } from '@base44/sdk';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your app ID - get this from base44/.app.jsonc
const appId = '6a1f8cbe6afda524efce28fa';

// Initialize Base44 client
const client = createClient({ 
    appId: appId
});

// All entities that might contain images
const entities = [
    'Barber', 'BlogPost', 'GalleryImage', 'Product', 
    'Service', 'User', 'Appointment', 'GiftCard', 
    'Membership', 'Order', 'Review', 'WaitlistEntry'
];

// Image field patterns
const imagePatterns = [
    'photo', 'image', 'avatar', 'picture', 'thumbnail', 
    'logo', 'banner', 'cover', 'gallery', 'before', 
    'after', 'profile', 'hero', 'featured'
];

const outputDir = process.argv[2] || 'public/images/actual';

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchAllData() {
    console.log('📡 Fetching data from Base44...');
    const allData = {};
    let totalRecords = 0;
    
    for (const entity of entities) {
        try {
            console.log(`  📁 Fetching ${entity}...`);
            const data = await client.entity.find(entity, { limit: 1000 });
            
            if (data && data.length > 0) {
                allData[entity] = data;
                totalRecords += data.length;
                console.log(`    ✅ Found ${data.length} records`);
            } else {
                console.log(`    ⚠️ No records found`);
            }
        } catch (error) {
            console.log(`    ❌ Failed: ${error.message}`);
        }
    }
    
    console.log(`\n📊 Total: ${totalRecords} records across ${Object.keys(allData).length} entities`);
    return allData;
}

function extractAllImageUrls(data) {
    const urls = new Set();
    
    function extract(obj) {
        if (!obj || typeof obj !== 'object') return;
        
        if (Array.isArray(obj)) {
            obj.forEach(item => extract(item));
            return;
        }
        
        for (const [key, value] of Object.entries(obj)) {
            const keyLower = key.toLowerCase();
            const isImageKey = imagePatterns.some(pattern => keyLower.includes(pattern));
            
            if (isImageKey && typeof value === 'string') {
                const matches = value.match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff)/gi);
                if (matches) {
                    matches.forEach(url => urls.add(url));
                }
            }
            
            if (typeof value === 'string') {
                const matches = value.match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff)/gi);
                if (matches) {
                    matches.forEach(url => urls.add(url));
                }
            }
            
            if (typeof value === 'object' && value !== null) {
                extract(value);
            }
        }
    }
    
    extract(data);
    return Array.from(urls);
}

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        let filename = path.basename(urlObj.pathname);
        
        if (!filename || filename === '/' || filename === '') {
            const ext = url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)/i)?.[1] || 'jpg';
            filename = `image_${Date.now()}.${ext}`;
        }
        filename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
        
        const outputPath = path.join(outputDir, filename);
        
        if (fs.existsSync(outputPath)) {
            console.log(`  ✅ ${filename} (already exists)`);
            resolve();
            return;
        }
        
        console.log(`  📥 ${filename}...`);
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
        };
        
        const protocol = url.startsWith('https') ? https : await import('http');
        protocol.get(url, options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            
            const fileStream = fs.createWriteStream(outputPath);
            response.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                const stats = fs.statSync(outputPath);
                console.log(`  ✅ ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
                resolve();
            });
            
            fileStream.on('error', reject);
        }).on('error', reject);
    });
}

async function main() {
    const data = await fetchAllData();
    
    console.log('\n🔍 Extracting image URLs...');
    const urls = extractAllImageUrls(data);
    
    console.log(`\n📊 Found ${urls.length} unique image URLs\n`);
    
    if (urls.length === 0) {
        console.log('⚠️ No images found. Your app might not have any data yet.');
        console.log('   Try running the app first and adding some data.');
        return;
    }
    
    console.log('📋 Image URLs:');
    urls.forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
    });
    
    console.log('\n📥 Downloading images...');
    console.log('=================================================');
    
    let success = 0;
    let failed = 0;
    
    const concurrency = 5;
    for (let i = 0; i < urls.length; i += concurrency) {
        const batch = urls.slice(i, i + concurrency);
        await Promise.all(
            batch.map(async (url) => {
                try {
                    await downloadImage(url);
                    success++;
                } catch (error) {
                    console.log(`  ❌ Failed: ${error.message}`);
                    failed++;
                }
            })
        );
    }
    
    console.log('\n=================================================');
    console.log(`✅ Successfully downloaded: ${success} images`);
    console.log(`❌ Failed: ${failed} images`);
    console.log(`📁 Images saved to: ${outputDir}`);
}

main().catch(console.error);
