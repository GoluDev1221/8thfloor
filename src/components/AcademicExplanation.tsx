import React, { useState, useEffect } from 'react';
import { CBackendStatus } from '../types';

export const AcademicExplanation: React.FC = () => {
  const [status, setStatus] = useState<CBackendStatus | null>(null);

  useEffect(() => {
    fetch('/api/c-status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      
      <div className="border-b border-[#E5DFD0] pb-2">
        <h1 className="font-serif text-2xl font-bold text-[#262322]">
          How This Project Works
        </h1>
        <p className="text-xs text-[#6B6562] font-medium">
          Simple step by step academic guide for Computer Programming
        </p>
      </div>

      {/* C Backend Status */}
      {status && (
        <div className="bg-[#1E1B1A] text-[#FAF6EE] p-4 rounded-lg font-mono text-xs space-y-1">
          <p className="font-bold text-amber-300">C Backend Status:</p>
          <p>Compiler: {status.gccVersion}</p>
          <p>Data File: complaints.dat ({status.dataFileSize})</p>
          <p>Subject: Computer Programming</p>
        </div>
      )}

      {/* Step 1: Project Architecture */}
      <section className="bg-white border border-[#E5DFD0] rounded-xl p-6 space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#262322]">
          1. System Architecture
        </h2>
        <p className="text-xs text-[#5C5552] leading-relaxed">
          This project connects a modern web user interface with a C language executable backend. Here is how the flow works:
        </p>
        <div className="bg-[#FAF6EE] border border-[#E5DFD0] p-3 rounded text-xs space-y-2 font-mono text-[#262322]">
          <p>Step 1: Student or Warden submits an action on the website.</p>
          <p>Step 2: The Web Server calls the C executable binary using system command execution.</p>
          <p>Step 3: The C program reads or writes binary data to complaints.dat file.</p>
          <p>Step 4: The C program prints JSON output to standard output.</p>
          <p>Step 5: The website displays the response live to the user.</p>
        </div>
      </section>

      {/* Step 2: C Structure */}
      <section className="bg-white border border-[#E5DFD0] rounded-xl p-6 space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#262322]">
          2. Structure (struct Complaint)
        </h2>
        <p className="text-xs text-[#5C5552] leading-relaxed">
          A structure groups different variable types into a single object. We defined a structure to store complete information for each complaint:
        </p>
        <pre className="c-code-box p-3 rounded font-mono text-xs overflow-x-auto">{`struct Complaint {
    int id;               // Unique ID generated automatically
    char studentName[50]; // Name of student
    char uid[20];         // Student UID
    char roomNo[15];      // Room number
    char category[30];    // Category of complaint
    char description[300];// Issue details
    char status[20];      // Pending or Completed
};`}</pre>
      </section>

      {/* Step 3: Array Memory Management */}
      <section className="bg-white border border-[#E5DFD0] rounded-xl p-6 space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#262322]">
          3. Memory Array Management
        </h2>
        <p className="text-xs text-[#5C5552] leading-relaxed">
          When displaying complaints, the C program reads all saved structures from disk into an array in RAM memory:
        </p>
        <pre className="c-code-box p-3 rounded font-mono text-xs overflow-x-auto">{`struct Complaint complaintsList[100];
int count = 0;

while (fread(&complaintsList[count], sizeof(struct Complaint), 1, file) == 1) {
    count++;
}`}</pre>
      </section>

      {/* Step 4: Permanent File Storage */}
      <section className="bg-white border border-[#E5DFD0] rounded-xl p-6 space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#262322]">
          4. Permanent File Handling (complaints.dat)
        </h2>
        <p className="text-xs text-[#5C5552] leading-relaxed">
          To save complaint data permanently across server restarts, we write struct records to a binary file named complaints.dat.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#FAF6EE] p-3 rounded border border-[#E5DFD0]">
            <strong className="text-[#B93829] block">fwrite() Function</strong>
            Writes a struct record from RAM memory directly into complaints.dat file.
          </div>
          <div className="bg-[#FAF6EE] p-3 rounded border border-[#E5DFD0]">
            <strong className="text-[#B93829] block">fread() Function</strong>
            Reads saved struct records from complaints.dat back into memory.
          </div>
        </div>
      </section>

      {/* Step 5: C Functions Explanation */}
      <section className="bg-white border border-[#E5DFD0] rounded-xl p-6 space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#262322]">
          5. Core C Functions Breakdown
        </h2>
        <div className="space-y-3 text-xs">
          <div className="border-[#E5DFD0] border p-3 rounded">
            <strong className="text-[#B93829] font-mono block">addComplaint()</strong>
            Generates the next unique integer ID, creates a struct record, and appends it to complaints.dat using binary file append mode.
          </div>

          <div className="border-[#E5DFD0] border p-3 rounded">
            <strong className="text-[#B93829] font-mono block">viewComplaints()</strong>
            Reads all complaint structs from complaints.dat into an array and formats them into JSON output for the web portal.
          </div>

          <div className="border-[#E5DFD0] border p-3 rounded">
            <strong className="text-[#B93829] font-mono block">searchComplaint()</strong>
            Performs a linear search scan through the file matching the requested Complaint ID.
          </div>

          <div className="border-[#E5DFD0] border p-3 rounded">
            <strong className="text-[#B93829] font-mono block">updateStatus()</strong>
            Scans the file to locate the Complaint ID, uses fseek() to rewind the file pointer to that record, and updates the status to Pending or Completed.
          </div>

          <div className="border-[#E5DFD0] border p-3 rounded">
            <strong className="text-[#B93829] font-mono block">deleteComplaint()</strong>
            Copies all complaints except the target ID to a temporary file temp.dat, removes the old complaints.dat file, and renames temp.dat to complaints.dat.
          </div>
        </div>
      </section>

    </div>
  );
};
