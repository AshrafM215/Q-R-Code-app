import React, { useState } from 'react';
import { QRMode, WifiConfig, VCardConfig } from '../types';
import { generateMagicContent } from '../services/geminiService';
import { 
  Type, Link, Wifi, UserSquare2, Sparkles, Loader2, 
  ArrowRight, QrCode
} from 'lucide-react';

interface InputPanelProps {
  mode: QRMode;
  setMode: (mode: QRMode) => void;
  onUpdateValue: (val: string) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ mode, setMode, onUpdateValue }) => {
  const [textVal, setTextVal] = useState('');
  const [wifi, setWifi] = useState<WifiConfig>({ ssid: '', password: '', encryption: 'WPA', hidden: false });
  const [vcard, setVcard] = useState<VCardConfig>({ firstName: '', lastName: '', phone: '', email: '', org: '', title: '', website: '' });
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleWifiChange = (key: keyof WifiConfig, val: any) => {
    const newWifi = { ...wifi, [key]: val };
    setWifi(newWifi);
    const wifiString = `WIFI:T:${newWifi.encryption};S:${newWifi.ssid};P:${newWifi.password};H:${newWifi.hidden};;`;
    onUpdateValue(wifiString);
  };

  const handleVcardChange = (key: keyof VCardConfig, val: string) => {
    const newVcard = { ...vcard, [key]: val };
    setVcard(newVcard);
    const vcardString = `BEGIN:VCARD\nVERSION:3.0\nN:${newVcard.lastName};${newVcard.firstName};;;\nFN:${newVcard.firstName} ${newVcard.lastName}\nORG:${newVcard.org}\nTITLE:${newVcard.title}\nTEL:${newVcard.phone}\nEMAIL:${newVcard.email}\nURL:${newVcard.website}\nEND:VCARD`;
    onUpdateValue(vcardString);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const content = await generateMagicContent(aiPrompt);
      onUpdateValue(content);
      // We don't change textVal here to allow user to see their prompt, but the QR preview updates
    } catch (err) {
      setAiError("Failed to generate content. Please check API Key configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const navItemClass = (itemMode: QRMode) => `
    flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-medium text-sm
    ${mode === itemMode 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
  `;

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <button onClick={() => setMode(QRMode.TEXT)} className={navItemClass(QRMode.TEXT)}>
          <Type className="w-4 h-4" /> Text
        </button>
        <button onClick={() => setMode(QRMode.URL)} className={navItemClass(QRMode.URL)}>
          <Link className="w-4 h-4" /> URL
        </button>
        <button onClick={() => setMode(QRMode.WIFI)} className={navItemClass(QRMode.WIFI)}>
          <Wifi className="w-4 h-4" /> Wi-Fi
        </button>
        <button onClick={() => setMode(QRMode.VCARD)} className={navItemClass(QRMode.VCARD)}>
          <UserSquare2 className="w-4 h-4" /> vCard
        </button>
        <button onClick={() => setMode(QRMode.AI_MAGIC)} className={`${navItemClass(QRMode.AI_MAGIC)} col-span-2 md:col-span-1 border-indigo-200`}>
          <Sparkles className="w-4 h-4" /> AI Magic
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
        {mode === QRMode.TEXT && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Plain Text</h3>
            <textarea
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50"
              placeholder="Enter your text here..."
              value={textVal}
              onChange={(e) => { setTextVal(e.target.value); onUpdateValue(e.target.value); }}
            />
          </div>
        )}

        {mode === QRMode.URL && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Website URL</h3>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="url"
                className="w-full p-4 pl-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
                placeholder="https://example.com"
                onChange={(e) => onUpdateValue(e.target.value)}
              />
            </div>
            <p className="text-sm text-slate-500">Enter a valid URL to ensure the QR code is scannable by all devices.</p>
          </div>
        )}

        {mode === QRMode.WIFI && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Wi-Fi Network</h3>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Network Name (SSID)</label>
              <input type="text" className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50" 
                value={wifi.ssid} onChange={(e) => handleWifiChange('ssid', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Password</label>
              <input type="text" className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50" 
                value={wifi.password} onChange={(e) => handleWifiChange('password', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Encryption</label>
                <select className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50"
                  value={wifi.encryption} onChange={(e) => handleWifiChange('encryption', e.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded"
                    checked={wifi.hidden} onChange={(e) => handleWifiChange('hidden', e.target.checked)} />
                  <span className="text-sm text-slate-600">Hidden Network</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {mode === QRMode.VCARD && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Digital Contact (vCard)</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="p-3 border rounded-lg bg-slate-50"
                value={vcard.firstName} onChange={(e) => handleVcardChange('firstName', e.target.value)} />
              <input placeholder="Last Name" className="p-3 border rounded-lg bg-slate-50"
                value={vcard.lastName} onChange={(e) => handleVcardChange('lastName', e.target.value)} />
            </div>
            <input placeholder="Phone Number" className="w-full p-3 border rounded-lg bg-slate-50"
              value={vcard.phone} onChange={(e) => handleVcardChange('phone', e.target.value)} />
            <input placeholder="Email" className="w-full p-3 border rounded-lg bg-slate-50"
              value={vcard.email} onChange={(e) => handleVcardChange('email', e.target.value)} />
             <input placeholder="Website" className="w-full p-3 border rounded-lg bg-slate-50"
              value={vcard.website} onChange={(e) => handleVcardChange('website', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Organization" className="p-3 border rounded-lg bg-slate-50"
                value={vcard.org} onChange={(e) => handleVcardChange('org', e.target.value)} />
              <input placeholder="Job Title" className="p-3 border rounded-lg bg-slate-50"
                value={vcard.title} onChange={(e) => handleVcardChange('title', e.target.value)} />
            </div>
          </div>
        )}

        {mode === QRMode.AI_MAGIC && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-purple-600" />
                 AI Content Generator
               </h3>
            </div>
            
            <p className="text-sm text-slate-600">
              Describe what you want the QR code to do. The AI will format it correctly for you.
            </p>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-sm text-purple-800">
              <strong>Try asking:</strong> "Make a Wi-Fi code for network 'Guest' with password '1234'" or "Write a funny valentine message"
            </div>

            <textarea
              className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-slate-50"
              placeholder="Describe your QR code content..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            
            <button 
              onClick={handleAiGenerate}
              disabled={isGenerating || !aiPrompt}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? "Generating Magic..." : "Generate with AI"}
            </button>
            {aiError && <p className="text-red-500 text-sm">{aiError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPanel;