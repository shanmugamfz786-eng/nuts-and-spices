import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
      console.error("FATAL ERROR: JWT_SECRET is not defined.");
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nuts_spices_dev_secret_only');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};
