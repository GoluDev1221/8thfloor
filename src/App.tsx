/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { StudentPanel } from './components/StudentPanel';
import { WardenPanel } from './components/WardenPanel';
import { AcademicExplanation } from './components/AcademicExplanation';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'student' | 'warden' | 'academic'>('home');
  const [isWardenLoggedIn, setIsWardenLoggedIn] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8EF] text-[#262322]">
      
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isWardenLoggedIn={isWardenLoggedIn}
        onWardenLogout={() => setIsWardenLoggedIn(false)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomePage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'student' && (
          <StudentPanel onComplaintSubmitted={() => {}} />
        )}

        {activeTab === 'warden' && (
          <WardenPanel
            isLoggedIn={isWardenLoggedIn}
            onLogin={() => setIsWardenLoggedIn(true)}
            onLogout={() => setIsWardenLoggedIn(false)}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicExplanation />
        )}
      </main>

      {/* Academic Footer */}
      <Footer />

    </div>
  );
}
