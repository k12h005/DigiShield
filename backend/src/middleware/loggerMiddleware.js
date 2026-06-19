const auditLogRepository = require('../repositories/auditLogRepository');

const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    const duration = Date.now() - start;
    const logData = {
      action: `${req.method} ${req.originalUrl}`,
      userId: req.user ? req.user.id : null,
      ip: req.ip,
      resource: req.originalUrl,
      status: res.statusCode
    };

    try {
      await auditLogRepository.create(logData);
    } catch (error) {
      console.error('[AuditLog] Failed to save log:', error.message);
    }

    console.log(`[Audit] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
};

module.exports = { logger };
