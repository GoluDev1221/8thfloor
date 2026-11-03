import React, { useState, useEffect } from 'react';
import { Complaint } from '../types';

interface WardenPanelProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const WardenPanel: React.FC<WardenPanelProps> = ({
  isLoggedIn,
  onLogin,
  onLogout,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track confirmation for delete action (replaces window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/complaints');
      if (!res.ok) throw new Error('Failed to load complaints.');
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not connect to C backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchComplaints();
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username.trim() === 'warden' && password.trim() === 'admin123') {
      onLogin();
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        fetchComplaints();
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch {
      alert('Network error.');
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setConfirmDeleteId(null);
        await fetchComplaints();
      } else {
        alert(data.message || 'Failed to delete complaint.');
      }
    } catch {
      alert('Network error during deletion.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.id.toString().includes(query) ||
      c.studentName.toLowerCase().includes(query) ||
      c.uid.toLowerCase().includes(query) ||
      c.roomNo.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-sm mx-auto my-10 bg-white border border-[#E5DFD0] rounded-xl p-6">
        <h1 className="font-serif text-xl font-bold text-[#262322] mb-4">
          Warden Login
        </h1>

        {loginError && (
          <div className="mb-4 p-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-bold text-[#262322] mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-3 py-1.5 bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#262322] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-1.5 bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#B93829] text-white font-bold rounded hover:bg-[#A62B1E] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5DFD0] pb-2">
        <h1 className="font-serif text-2xl font-bold text-[#262322]">
          Warden Dashboard
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchComplaints}
            className="px-3 py-1.5 bg-white border border-[#E5DFD0] text-xs font-bold rounded hover:bg-[#FAF6EE]"
          >
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded hover:bg-rose-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-3 py-1 rounded border ${filterStatus === 'All' ? 'bg-[#262322] text-white border-[#262322]' : 'bg-white border-[#E5DFD0] text-[#5C5552]'}`}
          >
            All ({complaints.length})
          </button>
          <button
            onClick={() => setFilterStatus('Pending')}
            className={`px-3 py-1 rounded border ${filterStatus === 'Pending' ? 'bg-[#262322] text-white border-[#262322]' : 'bg-white border-[#E5DFD0] text-[#5C5552]'}`}
          >
            Pending ({complaints.filter(c => c.status === 'Pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('Completed')}
            className={`px-3 py-1 rounded border ${filterStatus === 'Completed' ? 'bg-[#262322] text-white border-[#262322]' : 'bg-white border-[#E5DFD0] text-[#5C5552]'}`}
          >
            Completed ({complaints.filter(c => c.status === 'Completed').length})
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID, Name, UID, Room..."
          className="w-full sm:w-64 px-3 py-1 text-xs bg-white border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829]"
        />
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="text-center py-10 bg-white border border-[#E5DFD0] rounded text-xs font-bold text-[#6B6562]">
          Loading records from C backend...
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#E5DFD0] rounded p-6">
          <p className="font-serif text-lg font-bold text-[#262322]">
            No complaints submitted yet
          </p>
          <p className="text-xs text-[#6B6562] mt-1">
            Data file complaints.dat currently has 0 records.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((c) => (
            <div key={c.id} className="bg-white border border-[#E5DFD0] rounded-lg p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#E5DFD0] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#B93829]">#{c.id}</span>
                  <span className="font-bold text-[#262322] text-sm">{c.studentName}</span>
                  <span className="text-[#6B6562]">({c.uid})</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  c.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[#5C5552]">
                <p><strong>Room:</strong> {c.roomNo}</p>
                <p><strong>Category:</strong> {c.category}</p>
              </div>

              <p className="bg-[#FAF6EE] p-2.5 rounded border border-[#E5DFD0] text-[#262322] font-medium">
                "{c.description}"
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleUpdateStatus(c.id, c.status)}
                  className={`px-3 py-1 font-bold text-xs rounded transition-colors ${
                    c.status === 'Completed'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {c.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                </button>

                {confirmDeleteId === c.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="px-3 py-1 font-bold text-xs bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
                    >
                      {deletingId === c.id ? 'Deleting...' : 'Confirm Delete?'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 font-bold text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(c.id)}
                    className="px-3 py-1 font-bold text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded hover:bg-rose-100 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
