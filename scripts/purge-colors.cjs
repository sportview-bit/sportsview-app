const fs = require('fs');
const path = require('path');

const replacements = {
  '#34D399': '#065f46',
  '#F2B705': '#065f46',
  '#A78BFA': '#065f46',
  '#FF5468': '#991b1b',
  '#60A5FA': '#065f46'
};

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const [find, replace] of Object.entries(replacements)) {
        if (content.includes(find)) {
          content = content.split(find).join(replace);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Modified:', fullPath);
      }
    }
  });
}

walk('./src');
