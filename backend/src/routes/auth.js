import express from 'express';
import { findUserByUsername, validatePassword, getAllUsers } from '../config/users.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = findUserByUsername(username);

  if (!user || !validatePassword(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  });

  res.json({
    success: true,
    user: {
      username: user.username,
      name: user.name,
      role: user.role
    },
    token
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// List all users (admin only - optional)
router.get('/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.json({ users: getAllUsers() });
});

export default router;