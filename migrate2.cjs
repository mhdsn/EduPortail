const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  "import db from './src/db/index.js';",
  "import db, { initializeDB } from './src/db/index.js';"
);

server = server.replace(
  "async function startServer() {",
  "async function startServer() {\n  await initializeDB();"
);

fs.writeFileSync('server.ts', server);
console.log('Done server.ts initializeDB');
