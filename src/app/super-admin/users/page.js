"use client";

import React, { useEffect, useState } from "react";
import apiClient from '../../../lib/api/apiClient';
import { useDashboard } from '../../../contexts/DashboardContext';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SuperAdminUsersPage() {
  const { userData, isLoading } = useDashboard();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user" });

  React.useEffect(() => {
    if (!isLoading && (!userData || userData.role !== 'superAdmin')) {
      router.push('/login');
    }
  }, [isLoading, userData, router]);

  React.useEffect(() => {
    if (!isLoading && userData && userData.role === 'superAdmin') {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await apiClient.get('/super-admin/users');
          const filteredUsers = (response.data.data || []).filter(u => u.role !== 'customer');
          setUsers(filteredUsers);
        } catch (err) {
          setError("Failed to fetch users");
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isLoading, userData]);

  if (isLoading || loading) {
    return <div className="p-6">Loading users...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!userData || userData.role !== 'superAdmin') {
    return null;
  }

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open modal for add/edit
  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setForm(user ? { name: user.name, email: user.email, role: user.role } : { name: "", email: "", role: "user" });
    setShowModal(true);
  };

  // Add or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "add") {
        await apiClient.post('/users', form);
      } else if (modalType === "edit" && selectedUser) {
        await apiClient.put(`/users/${selectedUser._id}`, form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError("Failed to save user");
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Users</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
          onClick={() => openModal("add")}
        >
          Add User
        </button>
      </div>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Email</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Role</th>
                <th className="px-2 sm:px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{user.name}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap capitalize">{user.role}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right">
                    {/* <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => openModal("edit", user)}
                    >
                      Edit
                    </button> */}
                    {/* <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-2 sm:p-0">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-4">{modalType === "add" ? "Add User" : "Edit User"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
                >
                  {modalType === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 