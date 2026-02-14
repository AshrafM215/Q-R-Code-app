import React from 'react';
import { QRSettings } from '../types';
import { Settings, Sliders, Palette, Maximize } from 'lucide-react';

interface SettingsPanelProps {
  settings: QRSettings;
  onChange: (newSettings: QRSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  const handleChange = (key: keyof QRSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-lg">Appearance</h2>
      </div>

      <div className="space-y-6">
        {/* Colors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
            <Palette className="w-4 h-4" /> Colors
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Foreground</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.fgColor}
                  onChange={(e) => handleChange('fgColor', e.target.value)}
                  className="h-10 w-full rounded cursor-pointer border-0 p-0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.bgColor}
                  onChange={(e) => handleChange('bgColor', e.target.value)}
                  className="h-10 w-full rounded cursor-pointer border-0 p-0"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Size & Precision */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Maximize className="w-4 h-4" /> Size & Margin
          </div>
          
          <div>
            <label className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Size (px)</span>
              <span>{settings.size}px</span>
            </label>
            <input
              type="range"
              min="128"
              max="1024"
              step="32"
              value={settings.size}
              onChange={(e) => handleChange('size', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="flex items-center justify-between">
             <label className="text-sm text-slate-600">Include Margin</label>
             <input 
                type="checkbox" 
                checked={settings.includeMargin}
                onChange={(e) => handleChange('includeMargin', e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
             />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Error Correction */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Sliders className="w-4 h-4" /> Error Correction
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['L', 'M', 'Q', 'H'].map((level) => (
              <button
                key={level}
                onClick={() => handleChange('level', level)}
                className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                  settings.level === level
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Higher levels allow the QR code to be read even if partially obscured, but result in denser codes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;