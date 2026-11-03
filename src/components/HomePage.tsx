import React from 'react';

interface HomePageProps {
  setActiveTab: (tab: 'home' | 'student' | 'warden' | 'academic') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-4xl mx-auto my-12 text-center space-y-8">
      
      {/* Hero Section */}
      <section className="bg-[#FAF6EE] border border-[#E5DFD0] rounded-xl p-8 sm:p-12 space-y-6">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#262322] leading-tight">
          8th Floor - A Better Hostel Begins Here.
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('student')}
            className="w-full sm:w-auto px-8 py-3 bg-[#B93829] text-white font-bold text-sm rounded hover:bg-[#A62B1E] transition-colors shadow-sm"
          >
            Submit Complaint
          </button>

          <button
            onClick={() => setActiveTab('warden')}
            className="w-full sm:w-auto px-8 py-3 bg-white border border-[#262322] text-[#262322] font-bold text-sm rounded hover:bg-[#FAF6EE] transition-colors shadow-sm"
          >
            Warden Panel
          </button>
        </div>
      </section>

    </div>
  );
};
