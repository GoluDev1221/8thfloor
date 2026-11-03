import React, { useState } from 'react';
import { Complaint } from '../types';

interface StudentPanelProps {
  onComplaintSubmitted?: () => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({ onComplaintSubmitted }) => {
  const [studentName, setStudentName] = useState('');
  const [uid, setUid] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [category, setCategory] = useState('Electricity');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    id: number;
    message: string;
    studentName: string;
    uid: string;
    roomNo: string;
    category: string;
    description: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState<Complaint | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!studentName.trim() || !uid.trim() || !roomNo.trim() || !category.trim() || !description.trim()) {
      setErrorMessage('Please fill in all form fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          uid: uid.trim(),
          roomNo: roomNo.trim(),
          category: category.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setSubmissionResult({
          id: data.id,
          message: data.message,
          studentName: studentName.trim(),
          uid: uid.trim(),
          roomNo: roomNo.trim(),
          category: category.trim(),
          description: description.trim(),
        });
        setStudentName('');
        setUid('');
        setRoomNo('');
        setDescription('');
        if (onComplaintSubmitted) onComplaintSubmitted();
      } else {
        setErrorMessage(data.error || data.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      setErrorMessage('Network error: Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);

    const cleanId = lookupId.trim().replace('#', '');
    if (!cleanId || isNaN(Number(cleanId))) {
      setLookupError('Enter a valid numeric Complaint ID.');
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(`/api/complaints/${cleanId}`);
      const data = await res.json();

      if (res.ok && data.id) {
        setLookupResult(data);
      } else {
        setLookupError(data.message || `Complaint ID #${cleanId} not found.`);
      }
    } catch (err) {
      setLookupError('Error connecting to server.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      <div className="border-b border-[#E5DFD0] pb-2">
        <h1 className="font-serif text-2xl font-bold text-[#262322]">
          Student Panel
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Complaint Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5DFD0] rounded-xl p-6">
            <h2 className="font-serif text-lg font-bold text-[#262322] mb-4">
              Submit Complaint
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#262322] mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Student Name"
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#262322] mb-1">
                    UID
                  </label>
                  <input
                    type="text"
                    required
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    placeholder="UID"
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#262322] mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    required
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    placeholder="Room No"
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#262322] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829]"
                >
                  <option value="Electricity">Electricity</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Discipline">Discipline</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#262322] mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue..."
                  className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#B93829] text-white font-bold rounded hover:bg-[#A62B1E] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <div className="bg-[#FAF6EE] border border-emerald-600 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="font-bold text-emerald-800 text-sm">
                  Complaint Submitted Successfully
                </span>
                <span className="font-mono text-xl font-bold text-[#B93829]">
                  ID: #{submissionResult.id}
                </span>
              </div>

              <div className="text-xs space-y-1 text-[#262322]">
                <p><strong>Name:</strong> {submissionResult.studentName} | <strong>UID:</strong> {submissionResult.uid} | <strong>Room:</strong> {submissionResult.roomNo}</p>
                <p><strong>Category:</strong> {submissionResult.category}</p>
                <p><strong>Status:</strong> <span className="text-amber-700 font-bold">Pending</span></p>
                <p className="text-[#5C5552] pt-1">"{submissionResult.description}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Search Complaint ID */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5DFD0] rounded-xl p-5">
            <h2 className="font-serif text-base font-bold text-[#262322] mb-3">
              Check Complaint Status
            </h2>

            <form onSubmit={handleLookup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#262322] mb-1">
                  Complaint ID
                </label>
                <input
                  type="text"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="Complaint ID"
                  className="w-full px-3 py-1.5 text-sm bg-[#FAF6EE] border border-[#E5DFD0] rounded focus:outline-none focus:border-[#B93829] font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-2 bg-[#262322] text-[#FAF6EE] text-xs font-bold rounded hover:bg-black transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>

            {lookupError && (
              <div className="mt-3 p-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div className="mt-3 p-3 bg-[#FAF6EE] border border-[#E5DFD0] rounded text-xs space-y-1 text-[#262322]">
                <div className="flex items-center justify-between border-b border-[#E5DFD0] pb-1 mb-1">
                  <span className="font-mono font-bold text-[#B93829]">#{lookupResult.id}</span>
                  <span className={`font-bold ${lookupResult.status === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {lookupResult.status}
                  </span>
                </div>
                <p><strong>Student:</strong> {lookupResult.studentName}</p>
                <p><strong>Room:</strong> {lookupResult.roomNo}</p>
                <p><strong>Category:</strong> {lookupResult.category}</p>
                <p className="text-[#5C5552] pt-1">"{lookupResult.description}"</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
