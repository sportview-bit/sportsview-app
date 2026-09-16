const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-yellow-500': 'bg-emerald-900',
  'bg-yellow-400': 'bg-emerald-900',
  'bg-amber-500': 'bg-emerald-900',
  'bg-purple-600': 'bg-emerald-900',
  'bg-violet-600': 'bg-emerald-900',
  'bg-indigo-600': 'bg-emerald-900',
  'bg-indigo-500': 'bg-emerald-900',
  'hover:bg-yellow-600': 'hover:bg-emerald-800',
  'hover:bg-amber-600': 'hover:bg-emerald-800',
  'hover:bg-purple-700': 'hover:bg-emerald-800',
  'text-yellow-500': 'text-emerald-400',
  'text-amber-500': 'text-emerald-400',
  'text-purple-400': 'text-white',
  'border-yellow-500': 'border-emerald-600',
  'focus:border-yellow-500': 'focus:border-emerald-600'
};

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
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
