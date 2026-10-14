export const adminMiddleware = (req, res, next) => {
  const role = (req.user?.role || '').toLowerCase();
  if (!req.user || role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
  next();
};
