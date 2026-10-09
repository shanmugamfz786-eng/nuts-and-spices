import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryDb, memoryStore } from '../config/db.js';

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;
export const registerCustomer = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone number, and password are required.' });
    }

    const identifier = email || phone;

    // Check existing
    const existing = await queryDb('SELECT * FROM users WHERE phone = ? OR email = ?', [phone, identifier]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this phone or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}`;

    await queryDb(
      'INSERT INTO users (id, name, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), phone.trim(), email ? email.trim() : `${phone}@nutsandspices.in`, hashedPassword, 'customer']
    );

    const userObj = {
      id: userId,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : `${phone}@nutsandspices.in`,
      role: 'customer'
    };

    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

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

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Mobile number/email and password are required.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Query DB or fallback
    let userRecord = null;
    const users = await queryDb('SELECT * FROM users WHERE LOWER(phone) = ? OR LOWER(email) = ?', [cleanIdentifier, cleanIdentifier]);

    if (users && users.length > 0) {
      userRecord = users[0];
    } else {
      // Check memory store for admin/customer
      userRecord = memoryStore.users.find(u =>
        (u.phone && u.phone.toLowerCase() === cleanIdentifier) ||
        (u.email && u.email.toLowerCase() === cleanIdentifier)
      );
    }

    if (!userRecord) {
      return res.status(401).json({ success: false, message: 'Invalid phone/email or password.' });
    }

    const isMatch = await bcrypt.compare(password, userRecord.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid phone/email or password.' });
    }

    const userPayload = {
      id: userRecord.id,
      name: userRecord.name,
      phone: userRecord.phone,
      email: userRecord.email,
      role: userRecord.role
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

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
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
