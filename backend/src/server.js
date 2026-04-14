const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 8081;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n═══════════════════════════════════════`);
      console.log(`🚀 Billing Sembok API`);
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`═══════════════════════════════════════\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
