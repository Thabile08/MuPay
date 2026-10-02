export function errorHandler(err, req, res, _next) {
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.code || 'server_error' });
}