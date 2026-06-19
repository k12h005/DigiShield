require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[DigiShield] Server running on port ${PORT}`);
  console.log(`[DigiShield] Architecture: Production (Prisma + PostgreSQL)`);
  console.log(`[DigiShield] Security: Helmet, CORS, Rate Limiting, Audit Logging`);
});
