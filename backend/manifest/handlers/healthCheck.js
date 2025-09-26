module.exports = async (req, res) => {
  const timestamp = new Date().toISOString();
  const appId = req.get('X-App-ID') || 'Unknown';

  console.log(`🔍 [HEALTH] Health check requested at ${timestamp}`);
  console.log(`🔍 [HEALTH] App ID: ${appId}`);
  console.log(`🔍 [HEALTH] Origin: ${req.get('origin') || 'Unknown'}`);
  console.log(`🔍 [HEALTH] User-Agent: ${req.get('User-Agent') || 'Unknown'}`);

  try {
    // Enhanced CORS headers for StackBlitz and other origins
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-ID, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log(`🔍 [HEALTH] Handling OPTIONS preflight request`);
      res.sendStatus(200);
      return;
    }

    const healthStatus = {
      status: 'ok',
      timestamp: timestamp,
      appId: appId,
      manifest: 'connected',
      version: '4.16.1',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: {
        node: process.version,
        arch: process.arch,
        platform: process.platform
      },
      cors: {
        enabled: true,
        allowedOrigins: ['*'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-App-ID', 'X-Requested-With']
      }
    };

    console.log(`✅ [HEALTH] Health check successful:`, healthStatus);

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error(`❌ [HEALTH] Health check failed:`, error);

    // Enhanced CORS headers for error responses
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-ID, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    const errorStatus = {
      status: 'error',
      timestamp: timestamp,
      appId: appId,
      error: error.message,
      manifest: 'disconnected'
    };

    res.status(500).json(errorStatus);
  }
};