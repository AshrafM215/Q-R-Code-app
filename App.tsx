import React, { useState } from 'react';
import { QRMode, QRSettings } from './types';
import InputPanel from './components/InputPanel';
import SettingsPanel from './components/SettingsPanel';
import QRCodePreview from './components/QRCodePreview';
import { QrCode, Github } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<QRMode>(QRMode.TEXT);
  const [settings, setSettings] = useState<QRSettings>({
    value: '',
    size: 256,
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'M',
    includeMargin: true,
  });

  const updateValue = (val: string) => {
    setSettings((prev) => ({ ...prev, value: val }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QGen Pro
              </h1>
              <p className="text-xs text-slate-500 font-medium">AI-Powered Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                Gemini 3 Flash
             </span>
             <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Create QR Code</h2>
              <p className="text-slate-500 mb-6">Select a type and enter your content to get started.</p>
              <InputPanel 
                mode={mode} 
                setMode={setMode} 
                onUpdateValue={updateValue} 
              />
            </section>
          </div>

          {/* Right Column: Settings & Preview (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col md:flex-row gap-8 lg:h-[calc(100vh-140px)] lg:sticky lg:top-24">
            
            {/* Settings (Mobile: Order 2, Desktop: Order 1) */}
            <div className="flex-1 order-2 md:order-1">
              <SettingsPanel 
                settings={settings} 
                onChange={setSettings} 
              />
            </div>

            {/* Preview (Mobile: Order 1, Desktop: Order 2) */}
            <div className="flex-1 order-1 md:order-2">
              <QRCodePreview settings={settings} />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default App;