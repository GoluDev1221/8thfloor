import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#262322] text-[#FAF6EE] border-t-2 border-[#B93829] mt-12 py-8 px-4 text-xs">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="border-b border-stone-800 pb-4">
          <span className="font-serif text-lg font-bold text-white block">
            8th Floor - Hostel Grievance Management System
          </span>
          <span className="text-stone-400">A Better Hostel Begins Here.</span>
        </div>

        {/* Full Project Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-stone-300">
          <div>
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Student Name</span>
            <span className="font-bold text-white">Piyush Joshi</span>
            <span className="block font-mono text-[11px] text-stone-400">UID: 26BCD10227</span>
          </div>

          <div>
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Section & University</span>
            <span className="font-bold text-white">Section 26BCD4A</span>
            <span className="block text-stone-400">Chandigarh University</span>
          </div>

          <div>
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Submitted To</span>
            <span className="font-bold text-white">Khushi Aggarwal Ma'am</span>
            <span className="block text-stone-400">Assistant Professor</span>
          </div>

          <div>
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Subject</span>
            <span className="font-bold text-white">Computer Programming</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
