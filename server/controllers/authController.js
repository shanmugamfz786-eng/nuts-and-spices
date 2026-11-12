import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryDb, memoryStore } from '../config/db.js';

export const normalizeIdentifier = (input) => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  // If it looks like a phone number (e.g. starts with +91, contains dashes, spaces or 10+ digits)
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length >= 10 && (trimmed.startsWith('+') || !trimmed.includes('@'))) {
    return digitsOnly.slice(-10);
  }
  return trimmed.toLowerCase();
};

const getJwtSecret = () => process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod';

export const registerCustomer = async (req, res) => {
  try {
    const { name, phone, email, password, pincode } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone number, and password are required.' });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a valid name (at least 2 characters).' });
    }

    // Phone format: 10-digit Indian mobile number
    const cleanPhone = normalizeIdentifier(phone);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number.' });
    }

    // Pincode format: 6-digit number (if provided)
    let cleanPincode = null;
    if (pincode && typeof pincode === 'string' && pincode.trim().length > 0) {
      if (!/^\d{6}$/.test(pincode.trim())) {
        return res.status(400).json({ success: false, message: 'Delivery pincode must be a 6-digit number.' });
      }
      cleanPincode = pincode.trim();
    }

    // Password format: minimum 8 characters
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    // Email format (if provided)
    let cleanEmail = `${cleanPhone}@nutsandspices.in`;
    if (email && typeof email === 'string' && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      }
      cleanEmail = email.trim().toLowerCase();
    }

    // Check existing phone or email
    const existing = await queryDb('SELECT id FROM users WHERE phone = ? OR LOWER(email) = ? LIMIT 1', [cleanPhone, cleanEmail]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this phone or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${crypto.randomUUID()}`;

    // Force role to 'customer' - never allow clients to set their own role
    await queryDb(
      'INSERT INTO users (id, name, phone, email, password, role, pincode) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), cleanPhone, cleanEmail, hashedPassword, 'customer', cleanPincode]
    );

    const userObj = {
      id: userId,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      role: 'customer',
      pincode: cleanPincode
    };

    const token = jwt.sign(userObj, getJwtSecret(), { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: userObj
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await queryDb('SELECT id, name, email, phone, role, pincode, created_at FROM users');
    res.json({ success: true, users: users || (process.env.NODE_ENV !== 'production' ? memoryStore.users : []) });
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Database service unavailable' });
    }
    res.json({ success: true, users: memoryStore.users });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await queryDb('DELETE FROM users WHERE id = ?', [id]);
    memoryStore.users = memoryStore.users.filter(u => u.id != id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Mobile number/email and password are required.' });
    }

    const normalized = normalizeIdentifier(identifier);
    const rawTrimmed = identifier.trim().toLowerCase();

    // Query DB with both normalized phone/email and raw format for backward compatibility
    let userRecord = null;
    const users = await queryDb(
      'SELECT * FROM users WHERE phone = ? OR LOWER(phone) = ? OR LOWER(email) = ? OR LOWER(email) = ? LIMIT 1',
      [normalized, rawTrimmed, normalized, rawTrimmed]
    );

    if (users && users.length > 0) {
      userRecord = users[0];
    } else {
      // Check memory store for admin/customer
      userRecord = memoryStore.users.find(u =>
        (u.phone && (u.phone === normalized || u.phone.toLowerCase() === rawTrimmed)) ||
        (u.email && (u.email.toLowerCase() === normalized || u.email.toLowerCase() === rawTrimmed))
      );
    }

    if (!userRecord) {
      return res.status(401).json({ success: false, message: 'Invalid mobile number/email or password.' });
    }

    const isMatch = await bcrypt.compare(password, userRecord.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid mobile number/email or password.' });
    }

    const userPayload = {
      id: userRecord.id,
      name: userRecord.name,
      phone: userRecord.phone,
      email: userRecord.email,
      role: userRecord.role,
      pincode: userRecord.pincode || null
    };

    const token = jwt.sign(userPayload, getJwtSecret(), { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());

    // Fetch latest user data from DB if available
    let freshUser = decoded;
    if (decoded && decoded.id) {
      try {
        const rows = await queryDb('SELECT id, name, phone, email, role, pincode FROM users WHERE id = ? LIMIT 1', [decoded.id]);
        if (rows && rows.length > 0) {
          freshUser = {
            id: rows[0].id,
            name: rows[0].name,
            phone: rows[0].phone,
            email: rows[0].email,
            role: rows[0].role,
            pincode: rows[0].pincode || null
          };
        }
      } catch (dbErr) {
        console.warn('Could not refresh user from DB, using token payload:', dbErr.message);
      }
    }

    res.json({
      success: true,
      user: freshUser
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const updateCurrentUser = async (req, res) => {
  try {
    const { name, pincode } = req.body;
    if (!name && pincode === undefined) {
      return res.status(400).json({ success: false, message: 'Name or Pincode is required to update.' });
    }

    let cleanPincode = undefined;
    if (pincode !== undefined) {
      if (pincode && typeof pincode === 'string' && pincode.trim().length > 0) {
        if (!/^\d{6}$/.test(pincode.trim())) {
          return res.status(400).json({ success: false, message: 'Delivery pincode must be exactly 6 digits.' });
        }
        cleanPincode = pincode.trim();
      } else if (pincode === null || pincode === '') {
        cleanPincode = null;
      }
    }
    
    // User ID is available in req.user from authMiddleware
    const userId = req.user.id || req.user.userId;
    
    // Update in TiDB / MySQL
    if (userId) {
      if (name && cleanPincode !== undefined) {
        await queryDb('UPDATE users SET name = ?, pincode = ? WHERE id = ?', [name.trim(), cleanPincode, userId]);
      } else if (name) {
        await queryDb('UPDATE users SET name = ? WHERE id = ?', [name.trim(), userId]);
      } else if (cleanPincode !== undefined) {
        await queryDb('UPDATE users SET pincode = ? WHERE id = ?', [cleanPincode, userId]);
      }
    }

    // Also update in memoryStore just in case
    if (req.user.phone) {
      const memUser = memoryStore.users.find(u => u.phone === req.user.phone);
      if (memUser) {
        if (name) memUser.name = name.trim();
        if (cleanPincode !== undefined) memUser.pincode = cleanPincode;
      }
    }
    
    // Issue a new token with updated user details
    const { iat, exp, ...restUser } = req.user;
    const userPayload = { 
      ...restUser, 
      ...(name ? { name: name.trim() } : {}),
      ...(cleanPincode !== undefined ? { pincode: cleanPincode } : {})
    };
    const token = jwt.sign(userPayload, getJwtSecret(), { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userPayload,
      token
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password cannot be identical to current password.' });
    }

    const userId = req.user.id || req.user.userId;
    const phone = req.user.phone;
    const email = req.user.email;

    let userRecord = null;
    if (userId) {
      const users = await queryDb('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
      if (users && users.length > 0) userRecord = users[0];
    }

    if (!userRecord && (phone || email)) {
      const users = await queryDb('SELECT * FROM users WHERE phone = ? OR email = ? LIMIT 1', [phone, email]);
      if (users && users.length > 0) userRecord = users[0];
    }

    if (!userRecord) {
      userRecord = memoryStore.users.find(u => 
        (userId && u.id === userId) ||
        (phone && u.phone === phone) ||
        (email && u.email === email)
      );
    }

    if (!userRecord) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Verify current password with bcrypt
    const isMatch = await bcrypt.compare(currentPassword, userRecord.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in database
    if (userRecord.id) {
      await queryDb('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userRecord.id]);
    }

    // Update in memoryStore
    userRecord.password = hashedPassword;

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error while changing password.' });
  }
};

