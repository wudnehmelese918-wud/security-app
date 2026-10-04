'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Mail,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface UserAccount {
  _id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'assistant' | 'guest';
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'assistant' | 'guest'>('assistant');
  const [creating, setCreating] = useState(false);

  // Edit user state
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'assistant' | 'guest'>('assistant');
  const [editIsActive, setEditIsActive] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load user accounts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({ title: 'Validation error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Validation error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setCreating(true);
    try {
      await api.post('/users', { fullName, email, password, role });
      toast({ title: '✅ Account created', description: `User ${fullName} has been added.` });
      setShowAddModal(false);
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('assistant');
      fetchUsers();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create user account';
      toast({ title: '❌ Error', description: msg, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUpdating(true);
    try {
      await api.put(`/users/${editingUser._id}`, {
        fullName: editFullName,
        role: editRole,
        isActive: editIsActive,
      });
      toast({ title: '✅ Updated', description: 'Account updated successfully.' });
      setEditingUser(null);
      fetchUsers();
    } catch {
      toast({ title: 'Error', description: 'Failed to update account', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    if (deleteTarget._id === currentUser?._id) {
      toast({ title: 'Cannot delete self', description: 'You cannot delete your own account.', variant: 'destructive' });
      setDeleteTarget(null);
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      toast({ title: '✅ Deleted', description: `Account for ${deleteTarget.fullName} deleted.` });
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete user account', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const startEdit = (u: UserAccount) => {
    setEditingUser(u);
    setEditFullName(u.fullName);
    setEditRole(u.role);
    setEditIsActive(u.isActive);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-dbu-blue" />
            User Accounts
          </h1>
          <p className="text-gray-500 text-sm">
            Manage security guards, gate assistants, and campus administrators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-1.5">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1.5 bg-dbu-blue hover:bg-blue-800 text-white"
          >
            <UserPlus className="w-4 h-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Role explanation alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-900">
        <Shield className="w-5 h-5 text-dbu-blue shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Role-Based Access Control:</p>
          <p className="text-blue-800 text-xs leading-relaxed">
            • <strong>Administrator:</strong> Full system access, register equipment, gate scan, audit logs, manage accounts.<br />
            • <strong>Assistant / Guard:</strong> Register new equipment, perform gate scans, view logs.<br />
            • <strong>Guest / Auditor:</strong> Read-only access to dashboard statistics, equipment lists, and logs.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dbu-blue" />
            <p className="text-gray-400 text-sm">Loading accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Users className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">No accounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase border-b text-xs">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold">User</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Email</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Role</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Created</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const isCurrent = u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-dbu-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                              {u.fullName}
                              {isCurrent && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  YOU
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-600 font-mono text-xs">
                        {u.email}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                            Administrator
                          </span>
                        ) : u.role === 'assistant' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            Assistant (Guard)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            Guest Auditor
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                            <XCircle className="w-3 h-3 text-red-500" />
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(u)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                            title="Edit Account"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {!isCurrent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(u)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-dbu-blue" />
                Add New Security Account
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fullname">Full Name *</Label>
                <Input
                  id="fullname"
                  placeholder="e.g. Almaz Kebede"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email / Username *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="almaz@dbu.edu.et"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="pass">Initial Password *</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="pass"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="role">Role Permission *</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'assistant' | 'guest')}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
                >
                  <option value="assistant">Assistant (Gate Guard)</option>
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="guest">Guest (Read Only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-dbu-blue hover:bg-blue-800 text-white"
                >
                  {creating ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-dbu-blue" />
                Edit Account: {editingUser.email}
              </h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'admin' | 'assistant' | 'guest')}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
                >
                  <option value="assistant">Assistant (Gate Guard)</option>
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="guest">Guest (Read Only)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="active-chk"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-dbu-blue focus:ring-dbu-blue"
                />
                <Label htmlFor="active-chk" className="cursor-pointer text-sm font-medium">
                  Account Active and Enabled
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-dbu-blue hover:bg-blue-800 text-white"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-100 p-2.5 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Delete Account?</h2>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the account for{' '}
              <strong>{deleteTarget.fullName}</strong> ({deleteTarget.email})? They will immediately
              lose access to the security system.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
