import React from 'react';

interface NavbarProps {
  activeTab: 'home' | 'student' | 'warden' | 'academic';
  setActiveTab: (tab: 'home' | 'student' | 'warden' | 'academic') => void;
  isWardenLoggedIn: boolean;
  onWardenLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isWardenLoggedIn,
  onWardenLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE] border-b border-[#E5DFD0]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer font-serif text-xl sm:text-2xl font-bold text-[#262322] tracking-tight shrink-0"
        >
          8TH FLOOR
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#5C5552]">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'home' ? 'text-[#B93829] font-bold' : 'hover:text-[#262322]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'student' ? 'text-[#B93829] font-bold' : 'hover:text-[#262322]'
            }`}
          >
            Student Panel
          </button>

          <button
            onClick={() => setActiveTab('warden')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'warden' ? 'text-[#B93829] font-bold' : 'hover:text-[#262322]'
            }`}
          >
            Warden Panel {isWardenLoggedIn && '•'}
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'academic' ? 'text-[#B93829] font-bold' : 'hover:text-[#262322]'
            }`}
          >
            How It Works
          </button>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isWardenLoggedIn ? (
            <button
              onClick={onWardenLogout}
              className="px-3 py-1.5 text-xs font-bold text-[#B93829] border border-[#B93829] rounded hover:bg-[#B93829]/10 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('student')}
              className="px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#B93829] rounded hover:bg-[#A62B1E] transition-colors"
            >
              Submit Complaint
            </button>
          )}
        </div>

      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E5DFD0] py-2 text-xs font-semibold text-[#5C5552] bg-[#FAF6EE]">
        <button
          onClick={() => setActiveTab('home')}
          className={activeTab === 'home' ? 'text-[#B93829] font-bold' : ''}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={activeTab === 'student' ? 'text-[#B93829] font-bold' : ''}
        >
          Student
        </button>
        <button
          onClick={() => setActiveTab('warden')}
          className={activeTab === 'warden' ? 'text-[#B93829] font-bold' : ''}
        >
          Warden
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={activeTab === 'academic' ? 'text-[#B93829] font-bold' : ''}
        >
          How It Works
        </button>
      </div>
    </header>
  );
};
