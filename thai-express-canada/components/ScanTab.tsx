
import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';

const ScanTab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [scanned, setScanned] = useState(false);

  const simulateScan = () => {
    setScanned(true);
    setTimeout(() => {
        alert("Scan Successful! (Simulation)");
        setScanned(false);
        onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black z-[70] flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-6 text-white absolute top-0 left-0 right-0 z-30">
         <span className="font-bold text-lg drop-shadow-md">Scan QR / Barcode</span>
         <button onClick={onClose} className="bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
            <X size={24} />
         </button>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-900" onClick={simulateScan}>
          {/* Background camera simulation */}
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
               className="w-full h-full object-cover opacity-60" 
               alt="Camera preview"
             />
          </div>

          {/* Scan Frame */}
          <div className={`relative w-64 h-64 border-2 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10 transition-colors duration-300 ${scanned ? 'border-green-500 bg-green-500/20' : 'border-thai-lime bg-transparent'}`}>
              {!scanned && (
                <>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-sm"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-sm"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-sm"></div>
                  
                  {/* Scan Line Animation */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
                </>
              )}
              
              {scanned && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg animate-pulse">
                      Processing...
                  </div>
              )}
          </div>
          
          <div className="absolute bottom-32 left-0 right-0 text-white z-20 text-center px-8">
             <div className="bg-black/50 backdrop-blur-md py-3 px-6 rounded-full inline-block">
                <p className="font-medium text-sm">Align QR code within the frame</p>
                <p className="text-xs text-gray-300 mt-1">(Tap screen to simulate scan)</p>
             </div>
          </div>

          {/* Capture Button (Visual only) */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
              <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white rounded-full"></div>
              </button>
          </div>
      </div>

       <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScanTab;
