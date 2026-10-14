import React, { useState } from 'react';
import { 
  Phone, MessageSquare, Calendar, Search, MapPin, 
  ChevronRight, Shield, Laptop, Smartphone, Tablet, 
  Watch, Headphones, HelpCircle, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import { 
  APPLE_OFFICES, REGIONAL_SUPPORT_LINES, APPLE_PRODUCTS_LIST, 
  COMMON_SUPPORT_TOPICS, APPLE_RETAIL_STORES 
} from '../data/mockData';
import { GeniusBarBooking } from '../types';

interface AppleSupportHubProps {
  onOpenGeniusBar: (product?: string) => void;
  onOpenLiveChat: () => void;
  onOpenCall: (name: string, number: string) => void;
  onOpenFeedback: () => void;
  onNavigateToICloud: () => void;
  userBookings: GeniusBarBooking[];
}

export const AppleSupportHub: React.FC<AppleSupportHubProps> = ({
  onOpenGeniusBar,
  onOpenLiveChat,
  onOpenCall,
  onOpenFeedback,
  onNavigateToICloud,
  userBookings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [callbackRequested, setCallbackRequested] = useState<string | null>(null);

  // Filter support lines
  const filteredLines = REGIONAL_SUPPORT_LINES.filter((line) => {
    if (regionFilter !== 'All' && line.region !== regionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return line.country.toLowerCase().includes(q) || line.number.includes(q);
    }
    return true;
  });

  const handleRequestCallback = (country: string, number: string) => {
    setCallbackRequested(country);
    setTimeout(() => {
      setCallbackRequested(null);
      onOpenCall(`Apple Support (${country})`, number);
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-black text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10">
          <div className="max-w-2xl space-y-6">
            <div className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
              Official Contact & Support Portal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white text-balance leading-tight">
              How can Apple help you today?
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Connect with Apple certified specialists, book hands-on Genius Bar triage, or locate corporate headquarters worldwide.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenGeniusBar()}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-all cursor-pointer shadow-sm active:scale-98"
              >
                Book Genius Bar Appointment
              </button>
              <button
                onClick={onOpenLiveChat}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all cursor-pointer border border-white/20 active:scale-98"
              >
                Start Messages Chat
              </button>
              <button
                onClick={onNavigateToICloud}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white rounded-full transition-all cursor-pointer hover:underline"
              >
                Open iCloud Contacts →
              </button>
            </div>
          </div>
        </div>

        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_apple_park_1792020453790.jpg"
            alt="Apple Park in Cupertino"
            className="w-full h-full object-cover opacity-45"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        </div>
      </section>

      {/* EXISTING RESERVATIONS STRIP (If user has booked) */}
      {userBookings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#0071e3] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#0071e3] uppercase tracking-wide">
                  Active Genius Bar Pass
                </div>
                <div className="text-sm font-semibold text-zinc-900">
                  {userBookings[userBookings.length - 1].deviceName} · {userBookings[userBookings.length - 1].date} at {userBookings[userBookings.length - 1].timeSlot}
                </div>
                <div className="text-xs text-zinc-600">
                  {userBookings[userBookings.length - 1].storeName} · Pass: {userBookings[userBookings.length - 1].confirmationCode}
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenGeniusBar()}
              className="px-4 py-1.5 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer"
            >
              Book Another
            </button>
          </div>
        </section>
      )}

      {/* 2. CHOOSE YOUR PRODUCT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Hardware & Software
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Select a product for personalized support
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {APPLE_PRODUCTS_LIST.map((prod) => (
            <button
              key={prod.id}
              onClick={() => onOpenGeniusBar(prod.id)}
              className="p-5 bg-white hover:bg-zinc-50 rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition-all cursor-pointer text-center group flex flex-col items-center justify-between min-h-[140px]"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 group-hover:bg-blue-50 flex items-center justify-center text-zinc-700 group-hover:text-[#0071e3] transition-colors">
                {prod.id === 'iphone' && <Smartphone className="w-6 h-6" />}
                {prod.id === 'mac' && <Laptop className="w-6 h-6" />}
                {prod.id === 'ipad' && <Tablet className="w-6 h-6" />}
                {prod.id === 'watch' && <Watch className="w-6 h-6" />}
                {prod.id === 'airpods' && <Headphones className="w-6 h-6" />}
                {prod.id === 'vision' && <HelpCircle className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900 group-hover:text-[#0071e3] transition-colors">
                  {prod.name}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Get Support</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. TWO-COLUMN SPLIT: GENIUS BAR & SPECIALIST SUPPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Genius Bar Reservation */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/src/assets/images/apple_genius_bar_1792020453092.jpg"
                alt="Apple Genius Bar"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <span className="text-xs uppercase tracking-wider text-white/90 font-medium bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-md">
                  In-Store Support
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Genius Bar Reservations
                </h3>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                  Hands-on hardware repair and diagnostic support for iPhone, Mac, iPad, and Apple Watch. Genuine Apple parts and certified technicians.
                </p>
                <div className="mt-4 space-y-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Same-day screen and battery replacements at most locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free diagnostics and AppleCare+ claim processing</span>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => onOpenGeniusBar()}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-colors cursor-pointer"
                >
                  Schedule a Reservation
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Live Specialist Support */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/src/assets/images/apple_support_specialist_1792020453722.jpg"
                alt="Apple Support Specialist"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <span className="text-xs uppercase tracking-wider text-white/90 font-medium bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-md">
                  Real-Time Care
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Speak with an Apple Specialist
                </h3>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                  Whether you're setting up a new Apple device, troubleshooting iCloud, or resolving billing questions, our specialists are available 24/7.
                </p>
                <div className="mt-4 space-y-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Chat in Messages or request an immediate phone callback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Screen sharing and remote diagnostics support</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenLiveChat}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-colors cursor-pointer"
                >
                  Start Messages Chat
                </button>
                <button
                  onClick={() => onOpenCall('Apple Support', '1-800-275-2273')}
                  className="px-5 py-2.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Call 1-800-MY-APPLE</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INTERNATIONAL PHONE SUPPORT DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Direct Phone Lines
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Worldwide Apple Support Numbers
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Toll-free customer care lines with live call center queue estimations.
            </p>
          </div>

          {/* Region filter */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs overflow-x-auto no-scrollbar">
            {['All', 'Americas', 'Europe', 'Asia Pacific', 'Middle East & Africa'].map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  regionFilter === reg
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Support lines table / cards */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden divide-y divide-zinc-100">
          {filteredLines.map((line) => (
            <div
              key={line.country}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <span className="text-2xl" role="img" aria-label={line.country}>
                  {line.flag}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">{line.country}</span>
                    <span className="text-xs text-zinc-400">· {line.region}</span>
                    {line.tollFree && (
                      <span className="text-[11px] text-emerald-700 font-medium">Toll-free</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">{line.hours}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Languages: {line.languages.join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold text-zinc-900">
                    {line.number}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Wait time: <span className="tabular-nums font-semibold text-emerald-600">~{line.estimatedWaitMinutes} min</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRequestCallback(line.country, line.number)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  {callbackRequested === line.country ? 'Connecting...' : 'Call Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GLOBAL CORPORATE HEADQUARTERS & CAMPUSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Corporate Presence
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Apple Headquarters & Campuses
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Executive offices, hardware engineering campuses, and regional operating centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPLE_OFFICES.map((office) => (
            <div
              key={office.id}
              className="p-5 bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="text-[11px] font-medium text-[#0071e3] uppercase tracking-wider">
                  {office.type}
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mt-1">
                  {office.name}
                </h3>
                <div className="flex items-start gap-2 text-xs text-zinc-600 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                  <span>{office.address}, {office.city}, {office.country}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-2">
                  Hours: {office.hours}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenCall(office.name, office.phone)}
                  className="text-xs font-medium text-[#0071e3] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3" />
                  <span>{office.phone}</span>
                </button>

                <a
                  href={`https://maps.apple.com/?q=${encodeURIComponent(`${office.address}, ${office.city}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
                >
                  <span>Directions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. COMMON TOPICS & DIRECT FEEDBACK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-zinc-900 text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tight">
              Have feedback on an Apple product or website?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We value your thoughts. Submit bug reports, feature suggestions, or retail experience notes directly to Apple product teams in Cupertino.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenFeedback}
              className="px-5 py-2.5 text-xs font-semibold text-zinc-900 bg-white hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
            >
              Provide Product Feedback
            </button>
            <button
              onClick={onNavigateToICloud}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer border border-white/20"
            >
              Manage iCloud Contacts
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
