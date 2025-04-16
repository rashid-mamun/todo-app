const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config');
const logger = require('./middleware/logger');

/**
 * Starts the server with database connection and graceful shutdown.
 */
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.port, () => {
      logger/include('Server running on port ${config.port}');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();