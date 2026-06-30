const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src/components/landing'),
  path.join(__dirname, 'src/components')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Backgrounds
  content = content.replace(/#0e0d0b/g, '#03045e');
  
  // Specific gold (#c8a96e) replacements
  content = content.replace(/color: "#c8a96e"/g, 'color: "#48cae4"');
  content = content.replace(/color: '#c8a96e'/g, "color: '#48cae4'");
  content = content.replace(/text-\[\#c8a96e\]/g, 'text-[#48cae4]');
  content = content.replace(/background: "#c8a96e"/g, 'background: "#00b4d8"');
  content = content.replace(/background: '#c8a96e'/g, "background: '#00b4d8'");
  content = content.replace(/"#c8a96e"/g, '"#48cae4"'); // Catch all
  content = content.replace(/'#c8a96e'/g, "'#48cae4'"); // Catch all

  // rgba gold variants
  content = content.replace(/rgba\(200,169,110,/g, 'rgba(72,202,228,');
  content = content.replace(/rgba\(200, 169, 110,/g, 'rgba(72, 202, 228,');

  // Fonts
  content = content.replace(/'Playfair Display', Georgia, serif/g, "'Helvetica', Arial, sans-serif");
  content = content.replace(/'Playfair Display', serif/g, "'Helvetica', Arial, sans-serif");
  content = content.replace(/'DM Sans', sans-serif/g, "'Helvetica', Arial, sans-serif");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        // Skip Hero.tsx as it was already modified and we don't want to double process anything inadvertently
        // Wait, #0e0d0b etc was already removed from Hero.tsx, but just in case.
        if (file === 'Hero.tsx') return;
        processFile(path.join(dir, file));
      }
    });
  }
});

console.log('Landing page theme replacement completed.');
