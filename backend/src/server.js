const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
// Note: We're calling connectDB but it will log a warning if PG isn't configured yet.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[DigiShield] Server running on port ${PORT}`);
    console.log(`[DigiShield] Security filters active: Helmet, CORS, Rate Limiting`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
