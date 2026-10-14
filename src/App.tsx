/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AppleSupportHub } from './components/AppleSupportHub';
import { ICloudContacts } from './components/ICloudContacts';
import { GeniusBarModal } from './components/GeniusBarModal';
import { LiveChatModal } from './components/LiveChatModal';
import { CallSimulatorModal } from './components/CallSimulatorModal';
import { FeedbackModal } from './components/FeedbackModal';
import { Footer } from './components/Footer';
import { INITIAL_CONTACTS } from './data/mockData';
import { Contact, GeniusBarBooking } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'support' | 'genius' | 'directory' | 'icloud' | 'feedback'>('support');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [userBookings, setUserBookings] = useState<GeniusBarBooking[]>([]);

  // Modals state
  const [isGeniusModalOpen, setIsGeniusModalOpen] = useState(false);
  const [preselectedProduct, setPreselectedProduct] = useState<string | undefined>();
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Call simulator state
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callTarget, setCallTarget] = useState({
    name: 'Apple Support',
    number: '1-800-275-2273',
    type: 'phone' as 'phone' | 'facetime',
  });

  // Contact actions
  const handleAddContact = (newContact: Contact) => {
    setContacts((prev) => [newContact, ...prev]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Open Genius Bar Reservation
  const handleOpenGeniusBar = (product?: string) => {
    setPreselectedProduct(product);
    setIsGeniusModalOpen(true);
  };

  // Open Call Simulator
  const handleInitiateCall = (name: string, number: string, type: 'phone' | 'facetime' = 'phone') => {
    setCallTarget({ name, number, type });
    setIsCallOpen(true);
  };

  // Primary action button in Top Bar
  const handlePrimaryAction = () => {
    if (activeView === 'icloud') {
      // Trigger new contact creation in iCloud contacts
      const newContact: Contact = {
        id: `contact-${Date.now()}`,
        firstName: 'New',
        lastName: 'Contact',
        company: 'Apple',
        avatarBg: 'bg-[#0071e3]',
        phoneNumbers: [{ type: 'mobile', number: '+1 (408) 555-0199' }],
        emails: [{ type: 'icloud', email: 'user@icloud.com' }],
        group: 'Apple Team',
      };
      handleAddContact(newContact);
    } else {
      handleOpenGeniusBar();
    }
  };

  const primaryActionLabel = activeView === 'icloud' ? 'New Contact' : 'Book Genius Bar';

  // Booking confirmed handler
  const handleBookingConfirmed = (booking: GeniusBarBooking) => {
    setUserBookings((prev) => [...prev, booking]);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col selection:bg-[#0071e3] selection:text-white">
      {/* 1. Universal Top Bar Contract */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          if (view === 'genius') {
            handleOpenGeniusBar();
          } else if (view === 'feedback') {
            setIsFeedbackOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        onPrimaryAction={handlePrimaryAction}
        primaryActionLabel={primaryActionLabel}
      />

      {/* 2. Sub-Header Mode Switcher for Quick Navigation */}
      <div className="bg-white border-b border-black/[0.05] py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveView('support')}
              className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeView === 'support' || activeView === 'directory'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Contact Apple & Support Hub
            </button>
            <button
              onClick={() => setActiveView('icloud')}
              className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeView === 'icloud'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              iCloud Contacts Web App
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
            <span>24/7 Helpline: 1-800-MY-APPLE</span>
            <span>·</span>
            <button
              onClick={() => handleInitiateCall('Apple Support', '1-800-275-2273')}
              className="text-[#0071e3] hover:underline font-medium cursor-pointer"
            >
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main View Area */}
      <main className="flex-1">
        {activeView === 'icloud' ? (
          <ICloudContacts
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
            onInitiateCall={handleInitiateCall}
            onOpenLiveChat={() => setIsLiveChatOpen(true)}
          />
        ) : (
          <AppleSupportHub
            onOpenGeniusBar={handleOpenGeniusBar}
            onOpenLiveChat={() => setIsLiveChatOpen(true)}
            onOpenCall={(name, number) => handleInitiateCall(name, number, 'phone')}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onNavigateToICloud={() => setActiveView('icloud')}
            userBookings={userBookings}
          />
        )}
      </main>

      {/* 4. Global Modals & Simulators */}
      <GeniusBarModal
        isOpen={isGeniusModalOpen}
        onClose={() => setIsGeniusModalOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
        preselectedProduct={preselectedProduct}
      />

      <LiveChatModal
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        onBookGenius={() => handleOpenGeniusBar()}
        onRequestCall={() => handleInitiateCall('Apple Support Callback', '1-800-275-2273')}
      />

      <CallSimulatorModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        targetName={callTarget.name}
        targetNumber={callTarget.number}
        callType={callTarget.type}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* 5. Apple Footer */}
      <Footer
        onNavigate={(view) => {
          if (view === 'genius') {
            handleOpenGeniusBar();
          } else if (view === 'feedback') {
            setIsFeedbackOpen(true);
          } else {
            setActiveView(view);
          }
        }}
      />
    </div>
  );
}
