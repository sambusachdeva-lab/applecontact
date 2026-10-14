import React from 'react';
import { Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'support' | 'genius' | 'directory' | 'icloud' | 'feedback') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#f5f5f7] border-t border-black/[0.08] text-xs text-zinc-500 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Footnote text */}
        <div className="border-b border-black/[0.06] pb-4 space-y-1 text-[11px] text-zinc-500 leading-relaxed">
          <p>
            1. Genius Bar reservations and same-day repairs are subject to parts availability and technician scheduling. AppleCare+ terms apply.
          </p>
          <p>
            2. Toll-free support numbers are accessible from local carriers within each respective country. Standard cellular carrier rates may apply when roaming.
          </p>
        </div>

        {/* Directory columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-xs">
          <div>
            <h4 className="font-semibold text-zinc-800 mb-2.5">Explore Apple Contact</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-zinc-900 cursor-pointer text-left">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('genius')} className="hover:text-zinc-900 cursor-pointer text-left">
                  Genius Bar Reservations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('directory')} className="hover:text-zinc-900 cursor-pointer text-left">
                  Worldwide Phone Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('icloud')} className="hover:text-zinc-900 cursor-pointer text-left">
                  iCloud Contacts App
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-800 mb-2.5">Apple Retail & Services</h4>
            <ul className="space-y-1.5">
              <li><span className="text-zinc-600">Find a Store</span></li>
              <li><span className="text-zinc-600">Genius Bar</span></li>
              <li><span className="text-zinc-600">Today at Apple</span></li>
              <li><span className="text-zinc-600">Apple Trade In</span></li>
              <li><span className="text-zinc-600">Order Status</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-800 mb-2.5">Corporate & Press</h4>
            <ul className="space-y-1.5">
              <li><span className="text-zinc-600">Apple Leadership</span></li>
              <li><span className="text-zinc-600">Apple Newsroom</span></li>
              <li><span className="text-zinc-600">Career Opportunities</span></li>
              <li><span className="text-zinc-600">Investor Relations</span></li>
              <li><span className="text-zinc-600">Ethics & Compliance</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-800 mb-2.5">Apple Values</h4>
            <ul className="space-y-1.5">
              <li><span className="text-zinc-600">Accessibility</span></li>
              <li><span className="text-zinc-600">Education</span></li>
              <li><span className="text-zinc-600">Environment</span></li>
              <li><span className="text-zinc-600">Privacy</span></li>
              <li><span className="text-zinc-600">Supply Chain</span></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-zinc-800 mb-2.5">Feedback & Inquiries</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('feedback')} className="hover:text-zinc-900 cursor-pointer text-left">
                  Product Feedback
                </button>
              </li>
              <li><span className="text-zinc-600">Website Feedback</span></li>
              <li><span className="text-zinc-600">Legal Contact</span></li>
              <li><span className="text-zinc-600">Security Research</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-black/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            Copyright © {new Date().getFullYear()} Apple Inc. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Sales Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Legal</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Site Map</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-600">
            <Globe className="w-3.5 h-3.5" />
            <span>United States</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
