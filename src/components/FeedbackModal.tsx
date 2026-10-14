import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState('Product Bug or Issue');
  const [productCategory, setProductCategory] = useState('iPhone / iOS');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !comments) return;

    setRefId(`FB-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setComments('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-black/[0.08] p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <div className="text-xs text-zinc-500 font-normal">Cupertino Feedback Portal</div>
            <h2 className="text-lg font-semibold text-zinc-900">Apple Product & Service Feedback</h2>
          </div>
          <button
            onClick={handleReset}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Thank You for Your Feedback</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                Every submission is carefully reviewed by Apple engineering and product design teams in Cupertino.
              </p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg text-xs text-zinc-600 font-mono inline-block">
              Reference: {refId}
            </div>
            <div>
              <button
                onClick={handleReset}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Feedback Category</label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3] bg-white text-xs"
                >
                  <option>Product Bug or Issue</option>
                  <option>Feature Request</option>
                  <option>Apple Retail Experience</option>
                  <option>Website Accessibility</option>
                  <option>Executive Office Correspondence</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Product or Service</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3] bg-white text-xs"
                >
                  <option>iPhone / iOS</option>
                  <option>Mac / macOS</option>
                  <option>iPad / iPadOS</option>
                  <option>Apple Watch / watchOS</option>
                  <option>Apple Vision Pro / visionOS</option>
                  <option>iCloud & Apple Services</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Steve"
                  className="w-full p-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@icloud.com"
                  className="w-full p-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Your Comments or Suggestions *</label>
              <textarea
                required
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts, suggestions, or reproduction steps..."
                className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
              />
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              By submitting, you agree that Apple may use your feedback without compensation. Please do not submit confidential information.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer"
              >
                Submit to Apple
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
