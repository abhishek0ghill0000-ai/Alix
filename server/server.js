// server.js - Production server for Render (runs after npm run build)
require('dotenv').config();
const { app } = require('./dist/server'); // Compiled TypeScript

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Alix Production Server running on port ${PORT}`);
});

// Graceful shutdown for Render
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = server;