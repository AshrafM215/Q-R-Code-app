import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QRSettings } from '../types';
import { Download, Share2, Copy } from 'lucide-react';

interface QRCodePreviewProps {
  settings: QRSettings;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({ settings }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = (format: 'png' | 'jpeg') => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.${format}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopy = () => {
     const canvas = qrRef.current?.querySelector('canvas');
     if (canvas) {
        canvas.toBlob(blob => {
            if (blob) {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]);
                alert('Copied to clipboard!');
            }
        });
     }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      <h2 className="font-semibold text-lg text-slate-800 mb-6 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-indigo-600" />
        Preview
      </h2>

      <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200 p-8 min-h-[300px]">
        {settings.value ? (
          <div ref={qrRef} className="shadow-2xl rounded-lg overflow-hidden bg-white">
            <QRCodeCanvas
              value={settings.value}
              size={settings.size}
              fgColor={settings.fgColor}
              bgColor={settings.bgColor}
              level={settings.level}
              includeMargin={settings.includeMargin}
            />
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <div className="mb-2">Enter content to generate</div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => handleDownload('png')}
          disabled={!settings.value}
          className="py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> PNG
        </button>
        <button
          onClick={() => handleDownload('jpeg')}
          disabled={!settings.value}
          className="py-3 px-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> JPEG
        </button>
        <button
          onClick={handleCopy}
          disabled={!settings.value}
          className="col-span-2 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
           <Copy className="w-4 h-4" /> Copy Image to Clipboard
        </button>
      </div>
    </div>
  );
};

export default QRCodePreview;