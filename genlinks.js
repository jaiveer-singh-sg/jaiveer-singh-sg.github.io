const fs = require('fs');
const path = require('path');

const SUBFOLDER = './reports'; // Your subfolder
const INDEX_FILE = './index.html';

// 1. Read files from the subfolder
fs.readdir(SUBFOLDER, (err, files) => {
    if (err) return console.error('Could not scan directory:', err);

    // 2. Filter for only HTML files
    const htmlFiles = files.filter(file => path.extname(file) === '.html');

    // 3. Generate HTML link markup
    const linksHtml = htmlFiles
        .map(file => `            <li><a href="${SUBFOLDER}/${file}">${file}</a></li>`)
        .join('\n');

    // 4. Read the current index.html file
    let htmlContent = fs.readFileSync(INDEX_FILE, 'utf8');

    // 5. Use Regex to find the target container and replace its contents
    const regex = /(<ul id="dynamic-links-container">)[\s\S]*?(<\/ul>)/;
    
    if (regex.test(htmlContent)) {
        htmlContent = htmlContent.replace(regex, `$1\n${linksHtml}\n        $2`);
        
        // 6. Save the updated file
        fs.writeFileSync(INDEX_FILE, htmlContent);
        console.log('Success: Top section file links updated!');
    } else {
        console.error('Error: Could not find id="dynamic-links-container" in index.html');
    }
});
