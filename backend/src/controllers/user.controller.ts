import { Request, Response } from 'express';
import { User } from '../models/user.model';

/** GET /api/users */
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
};

/** GET /api/users/:id */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }
  res.json({ success: true, data: user });
};

/** PUT /api/users/:id */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { fullName, email, role, isActive },
    { new: true, runValidators: true }
  ).select('-password');
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }
  res.json({ success: true, data: user });
};

/** POST /api/users - Create new user */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password, role = 'assistant', isActive = true } = req.body;
  if (!fullName || !email || !password) {
    res.status(400).json({ message: 'Full name, email, and password are required' });
    return;
  }
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: 'User with this email already exists' });
    return;
  }
  const user = await User.create({ fullName, email, password, role, isActive });
  res.status(201).json({ success: true, data: user });
};

/** DELETE /api/users/:id */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
};

