const fs = require('fs');
let code = fs.readFileSync('src/db/index.ts', 'utf8');

code = code.replace(
  "connectionString: process.env.DATABASE_URL",
  "connectionString: process.env.DATABASE_URL,\n  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false }"
);

fs.writeFileSync('src/db/index.ts', code);
