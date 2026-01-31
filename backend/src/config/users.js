import bcrypt from 'bcryptjs';

// EDIT USER & PASSWORD DI SINI!
// Password akan di-hash otomatis saat server start
const USERS = [
  {
    username: 'admin',
    password: 'admin123',  // ← Ganti password ini
    role: 'admin',
    name: 'Administrator'
  },
  {
    username: 'zaky',
    password: 'zaky2024',  // ← Ganti password ini
    role: 'user',
    name: 'Zaky'
  },
  {
    username: 'korlantas',
    password: 'korlantas@2024',  // ← Ganti password ini
    role: 'viewer',
    name: 'Korlantas Viewer'
  },
  {
    username: 'operator',
    password: 'operator123',  // ← Tambah user baru di sini
    role: 'operator',
    name: 'Operator CCTV'
  }
];

// Hash passwords
const hashedUsers = USERS.map(user => ({
  ...user,
  password: bcrypt.hashSync(user.password, 10)
}));

export const findUserByUsername = (username) => {
  return hashedUsers.find(u => u.username === username);
};

export const validatePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const getAllUsers = () => {
  return hashedUsers.map(({ password, ...user }) => user);
};