const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(/app\.get\((.*?),\s*\((req, res)\)\s*=>/g, 'app.get($1, async ($2) =>');
server = server.replace(/app\.get\((.*?),\s*authMiddleware,\s*\((req: any, res)\)\s*=>/g, 'app.get($1, authMiddleware, async ($2) =>');
server = server.replace(/app\.get\((.*?),\s*authMiddleware,\s*adminMiddleware,\s*\((req, res)\)\s*=>/g, 'app.get($1, authMiddleware, adminMiddleware, async ($2) =>');

server = server.replace(/app\.post\((.*?),\s*\((req, res)\)\s*=>/g, 'app.post($1, async ($2) =>');
server = server.replace(/app\.post\((.*?),\s*authMiddleware,\s*\((req, res)\)\s*=>/g, 'app.post($1, authMiddleware, async ($2) =>');
server = server.replace(/app\.post\((.*?),\s*authMiddleware,\s*\((req: any, res)\)\s*=>/g, 'app.post($1, authMiddleware, async ($2) =>');
server = server.replace(/app\.post\((.*?),\s*authMiddleware,\s*adminMiddleware,\s*\((req, res)\)\s*=>/g, 'app.post($1, authMiddleware, adminMiddleware, async ($2) =>');

server = server.replace(/\]\),\s*\((req: any, res)\)\s*=>\s*\{/g, ']), async (req: any, res) => {');

// We have `db.prepare(...).get()`. We want `await db.prepare(...).get()`.
server = server.replace(/db\.prepare\(/g, 'await db.prepare(');

fs.writeFileSync('server.ts', server);
console.log('Done server.ts');
