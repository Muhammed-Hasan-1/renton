import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Load users error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("rentonToken");
        localStorage.removeItem("rentonUser");
        navigate("/signin");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access user management."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getCurrentUserId = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("rentonUser") || "{}"
      );

      return storedUser.id;
    } catch {
      return null;
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const currentUserId = getCurrentUserId();

    if (userId === currentUserId) {
      return;
    }

    try {
      setActionLoading(`role-${userId}`);
      setError("");

      const token = localStorage.getItem("rentonToken");

      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        {
          role: newRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, role: newRole }
            : user
        )
      );
    } catch (error) {
      console.error("Role update error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (userId, userName) => {
    const currentUserId = getCurrentUserId();

    if (userId === currentUserId) {
      setError(
        "You cannot delete your own admin account."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName || "this user"}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${userId}`);
      setError("");

      const token = localStorage.getItem("rentonToken");

      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error("Delete user error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setActionLoading("");
    }
  };

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((user) => user.role === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            User Management
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-emerald-50">
            View and manage registered Renton users.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Filter */}
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                FILTER USERS
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""}
              </h2>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All Users</option>
              <option value="customer">Customers</option>
              <option value="owner">Owners</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-600">
              Loading users...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">👥</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-800">
              No users found
            </h2>

            <p className="mt-2 text-slate-500">
              There are no users matching the selected filter.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                      User
                    </th>

                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                      Role
                    </th>

                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const isCurrentAdmin =
                      user._id === getCurrentUserId();

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-bold text-slate-800">
                              {user.name}
                              {isCurrentAdmin && (
                                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                                  You
                                </span>
                              )}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {user.phone || "—"}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold capitalize text-emerald-700">
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-5">
                          {isCurrentAdmin ? (
                            <span className="text-sm font-semibold text-slate-400">
                              Protected
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              <select
                                value={user.role}
                                disabled={
                                  actionLoading ===
                                  `role-${user._id}`
                                }
                                onChange={(e) =>
                                  handleRoleChange(
                                    user._id,
                                    e.target.value
                                  )
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
                              >
                                <option value="customer">
                                  Customer
                                </option>
                                <option value="owner">
                                  Owner
                                </option>
                                <option value="admin">
                                  Admin
                                </option>
                              </select>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    user._id,
                                    user.name
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  `delete-${user._id}`
                                }
                                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {actionLoading ===
                                `delete-${user._id}`
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-white"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}