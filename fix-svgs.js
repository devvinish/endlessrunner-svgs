const fs = require('fs');
const https = require('https');

const urls = {
    'playerImg': 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1faa8.svg',
    'mountainImg': 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/26f0.svg',
    'humanImg': 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f3c3.svg',
    'animalImg': 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f40e.svg'
};

async function fetchBase64(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(data);
                resolve('data:image/svg+xml;base64,' + buffer.toString('base64'));
            });
        }).on('error', reject);
    });
}

async function run() {
    let html = fs.readFileSync('kiwi-runner.html', 'utf8');
    
    for (const [key, url] of Object.entries(urls)) {
        const b64 = await fetchBase64(url);
        // Replace the URL with the base64 string
        html = html.replace(`'${url}'`, `'${b64}'`);
    }
    
    fs.writeFileSync('kiwi-runner.html', html);
    console.log('Successfully replaced SVGs with base64 Data URIs.');
}

run();
