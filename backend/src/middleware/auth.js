import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cctv-dashboard-secret-key-2024';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { 
      username: user.username, 
      role: user.role,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};