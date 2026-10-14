import React, { useState } from 'react';
import { X, Check, Calendar, Clock, MapPin, ChevronRight, ShieldCheck, QrCode } from 'lucide-react';
import { APPLE_PRODUCTS_LIST, APPLE_RETAIL_STORES } from '../data/mockData';
import { GeniusBarBooking } from '../types';

interface GeniusBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (booking: GeniusBarBooking) => void;
  preselectedProduct?: string;
}

export const GeniusBarModal: React.FC<GeniusBarModalProps> = ({
  isOpen,
  onClose,
  onBookingConfirmed,
  preselectedProduct,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedProduct, setSelectedProduct] = useState(preselectedProduct || 'iphone');
  const [issueCategory, setIssueCategory] = useState('Screen & Physical Damage');
  const [issueDescription, setIssueDescription] = useState('');
  const [selectedStore, setSelectedStore] = useState(APPLE_RETAIL_STORES[0].id);
  const [selectedDate, setSelectedDate] = useState('Today, Oct 15');
  const [selectedTime, setSelectedTime] = useState('2:30 PM');
  
  // Form details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<GeniusBarBooking | null>(null);

  if (!isOpen) return null;

  const dates = [
    'Today, Oct 15',
    'Tomorrow, Oct 16',
    'Friday, Oct 17',
    'Saturday, Oct 18',
  ];

  const timeSlots = [
    '10:15 AM', '11:00 AM', '1:30 PM', '2:30 PM', '3:45 PM', '4:30 PM', '5:15 PM'
  ];

  const issuesList = [
    { title: 'Screen & Physical Damage', desc: 'Cracked glass, OLED distortion, liquid damage' },
    { title: 'Battery & Power', desc: 'Fast drain, unexpected shutdown, charging port failure' },
    { title: 'System Performance & OS', desc: 'Freezing, boot loops, update failure, data recovery' },
    { title: 'Camera, Audio & Sensors', desc: 'Face ID failure, distorted speakers, microphone static' },
    { title: 'Setup, Migration & Genius Training', desc: 'Data transfer, trade-in inspection, personalized setup' },
  ];

  const storeObj = APPLE_RETAIL_STORES.find(s => s.id === selectedStore) || APPLE_RETAIL_STORES[0];
  const productObj = APPLE_PRODUCTS_LIST.find(p => p.id === selectedProduct) || APPLE_PRODUCTS_LIST[0];

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    const code = `GB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: GeniusBarBooking = {
      id: `booking-${Date.now()}`,
      confirmationCode: code,
      customerName: fullName,
      email,
      phone,
      deviceType: selectedProduct,
      deviceName: productObj.name,
      serialNumber: serialNumber || undefined,
      issueCategory,
      issueDescription: issueDescription || 'General diagnostic inspection',
      storeName: storeObj.name,
      storeAddress: storeObj.address,
      date: selectedDate,
      timeSlot: selectedTime,
      status: 'Confirmed',
    };

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setStep(6);
  };

  const handleReset = () => {
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <div className="text-xs text-zinc-500 font-normal">Apple Retail Store Reservation</div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {step === 6 ? 'Reservation Confirmed' : 'Genius Bar Appointment'}
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        {step < 6 && (
          <div className="px-6 py-2.5 bg-white border-b border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
            <span className={step >= 1 ? 'text-[#0071e3] font-medium' : ''}>1. Device</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={step >= 2 ? 'text-[#0071e3] font-medium' : ''}>2. Issue</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={step >= 3 ? 'text-[#0071e3] font-medium' : ''}>3. Store</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={step >= 4 ? 'text-[#0071e3] font-medium' : ''}>4. Time</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={step >= 5 ? 'text-[#0071e3] font-medium' : ''}>5. Details</span>
          </div>
        )}

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: DEVICE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Select your Apple device</h3>
                <p className="text-sm text-zinc-500">Choose the device that needs Genius Bar attention.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {APPLE_PRODUCTS_LIST.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedProduct === prod.id
                        ? 'border-[#0071e3] bg-blue-50/40 ring-2 ring-[#0071e3]/20'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-sm text-zinc-900">{prod.name}</div>
                    <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{prod.description}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer"
                >
                  Continue to Issue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ISSUE SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">What is happening with your {productObj.name}?</h3>
                <p className="text-sm text-zinc-500">Select the primary topic so our Geniuses have the parts ready.</p>
              </div>
              <div className="space-y-2">
                {issuesList.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setIssueCategory(item.title)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      issueCategory === item.title
                        ? 'border-[#0071e3] bg-blue-50/40 ring-1 ring-[#0071e3]'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{item.title}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{item.desc}</div>
                    </div>
                    {issueCategory === item.title && (
                      <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe symptoms, error codes, or recent drops..."
                  rows={2}
                  className="w-full text-sm p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
                />
              </div>
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer"
                >
                  Find a Store
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: STORE SELECTION */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Select an Apple Retail Store</h3>
                <p className="text-sm text-zinc-500">All locations feature authorized Apple certified Geniuses.</p>
              </div>
              <div className="space-y-2.5">
                {APPLE_RETAIL_STORES.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start justify-between ${
                      selectedStore === store.id
                        ? 'border-[#0071e3] bg-blue-50/40 ring-1 ring-[#0071e3]'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">{store.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{store.address}</span>
                      </div>
                      <div className="text-xs text-emerald-700 font-medium mt-1.5">
                        Earliest slot: {store.nextAvailableSlot}
                      </div>
                    </div>
                    {selectedStore === store.id && (
                      <span className="w-5 h-5 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer"
                >
                  Choose Time Slot
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DATE & TIME SELECTION */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Select Date & Time at {storeObj.name}</h3>
                <p className="text-sm text-zinc-500">Hardware triage takes approximately 15–20 minutes.</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Available Dates</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-3 rounded-lg text-center text-xs font-medium border transition-colors cursor-pointer ${
                        selectedDate === d
                          ? 'bg-[#0071e3] text-white border-[#0071e3]'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Slots</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 px-3 rounded-lg text-center text-xs font-medium border transition-colors cursor-pointer ${
                        selectedTime === t
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-600 flex items-start gap-2 border border-zinc-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Please back up your device to iCloud or a Mac before your appointment, and bring a valid photo ID.
                </span>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer"
                >
                  Contact Information
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CONTACT INFORMATION */}
          {step === 5 && (
            <form onSubmit={handleConfirmReservation} className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Your Contact Details</h3>
                <p className="text-sm text-zinc-500">We will send your reservation pass and status updates here.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Appleseed"
                    className="w-full text-sm p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Apple ID or Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@icloud.com"
                    className="w-full text-sm p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(408) 555-0123"
                    className="w-full text-sm p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Serial Number / IMEI (Optional)</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Found in Settings > General > About"
                    className="w-full text-sm p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              {/* Summary box */}
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1 text-xs">
                <div className="text-zinc-500">Summary:</div>
                <div className="font-medium text-zinc-900">{productObj.name} — {issueCategory}</div>
                <div className="text-zinc-600">{storeObj.name} · {selectedDate} at {selectedTime}</div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: CONFIRMATION RECEIPT */}
          {step === 6 && confirmedBooking && (
            <div className="space-y-6 text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900">You're Booked at the Genius Bar</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  A confirmation SMS and calendar invite have been sent to {confirmedBooking.phone}.
                </p>
              </div>

              {/* Pass Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-6 text-left shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="text-xs tracking-wider text-zinc-400 font-mono">GENIUS BAR PASS</div>
                  <div className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded text-white">
                    {confirmedBooking.confirmationCode}
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  <div>
                    <div className="text-xs text-zinc-400">Device & Issue</div>
                    <div className="text-base font-semibold">{confirmedBooking.deviceName}</div>
                    <div className="text-xs text-zinc-300">{confirmedBooking.issueCategory}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-400">Store</div>
                      <div className="text-sm font-medium">{confirmedBooking.storeName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">Date & Time</div>
                      <div className="text-sm font-medium">{confirmedBooking.date}</div>
                      <div className="text-xs text-zinc-300">{confirmedBooking.timeSlot}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-zinc-400">Customer</div>
                    <div className="text-xs font-medium">{confirmedBooking.customerName}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <QrCode className="w-5 h-5 text-white" />
                    <span>Scan at Check-in</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => alert(`Pass ${confirmedBooking.confirmationCode} added to Apple Wallet!`)}
                  className="w-full sm:w-auto px-5 py-2 text-xs font-medium text-white bg-black hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  Add to Apple Wallet
                </button>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
