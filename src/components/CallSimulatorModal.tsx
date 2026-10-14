import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Video, PhoneCall } from 'lucide-react';

interface CallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetNumber: string;
  callType: 'phone' | 'facetime';
}

export const CallSimulatorModal: React.FC<CallSimulatorModalProps> = ({
  isOpen,
  onClose,
  targetName,
  targetNumber,
  callType,
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setCallStatus('connecting');
      setSecondsElapsed(0);
      setIsMuted(false);
      setIsSpeaker(false);

      const connectTimeout = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);

      return () => clearTimeout(connectTimeout);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-zinc-900 to-black text-white rounded-3xl shadow-2xl border border-white/10 p-6 flex flex-col items-center justify-between min-h-[520px] overflow-hidden">
        
        {/* Top Status */}
        <div className="w-full text-center pt-4">
          <div className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
            {callType === 'facetime' ? 'FaceTime Audio' : 'Phone Call'}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mt-2">{targetName}</h2>
          <div className="text-xs text-zinc-400 mt-1 font-mono">{targetNumber}</div>

          <div className="text-sm font-medium mt-3 text-zinc-300">
            {callStatus === 'connecting' && (
              <span className="animate-pulse">Calling...</span>
            )}
            {callStatus === 'connected' && (
              <span className="font-mono text-emerald-400">{formatTimer(secondsElapsed)}</span>
            )}
            {callStatus === 'ended' && (
              <span className="text-rose-400">Call Ended</span>
            )}
          </div>
        </div>

        {/* Center Visual / Avatar */}
        <div className="my-6 flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-zinc-800 border-2 border-white/20 flex items-center justify-center shadow-xl">
              {callType === 'facetime' ? (
                <Video className="w-12 h-12 text-[#0071e3]" />
              ) : (
                <PhoneCall className="w-12 h-12 text-emerald-400" />
              )}
            </div>
            {callStatus === 'connected' && (
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
            )}
          </div>

          {callStatus === 'connected' && (
            <div className="mt-4 flex items-center gap-1">
              {[40, 75, 55, 90, 60, 80, 45, 65].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#0071e3] rounded-full transition-all animate-pulse"
                  style={{
                    height: `${h * 0.25}px`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call Controls Grid */}
        <div className="w-full space-y-6 pb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer mx-auto ${
                isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] mt-1 text-zinc-300">Mute</span>
            </button>

            {/* Keypad */}
            <button
              onClick={() => alert("Keypad opened (Simulated DTMF tones)")}
              className="p-3.5 rounded-full flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer mx-auto"
            >
              <div className="grid grid-cols-3 gap-0.5 w-5 h-5 place-items-center">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <span key={idx} className="w-1 h-1 bg-white rounded-full" />
                ))}
              </div>
              <span className="text-[10px] mt-1 text-zinc-300">Keypad</span>
            </button>

            {/* Speaker */}
            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer mx-auto ${
                isSpeaker ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] mt-1 text-zinc-300">Speaker</span>
            </button>
          </div>

          {/* End Call Button */}
          <div className="flex justify-center">
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
              aria-label="End Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
