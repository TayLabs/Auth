import env from './types/env';
import app from './app';
import runMigrations from './config/db/utils/runMigrations';

async function startServer() {
  try {
    await runMigrations();

    const port = env.PORT || 7313;
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
