
import React, { useState } from 'react';
import { Copy, Check, Eye, Code, Download, Sun, Moon, Coffee, Maximize2, Minimize2 } from 'lucide-react';

interface PreviewProps {
  html: string;
}

type Theme = 'light' | 'sepia' | 'dark';

const Preview: React.FC<PreviewProps> = ({ html }) => {
  const [activeTab, setActiveTab] = useState<'CODE' | 'VISUAL'>('VISUAL');
  const [theme, setTheme] = useState<Theme>('sepia');
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [copied, setCopied] = useState(false);

  const themes = {
    light: { bg: 'bg-white', text: '#1e293b', accent: '#f8fafc' },
    sepia: { bg: 'bg-[#f4ecd8]', text: '#5b4636', accent: '#efe3c5' },
    dark: { bg: 'bg-[#1a1a1a]', text: '#d1d5db', accent: '#262626' }
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capitulo-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex space-x-1">
          <button onClick={() => setActiveTab('VISUAL')} className={`preview-tab-btn ${activeTab === 'VISUAL' ? 'active' : ''}`}><Eye size={14} /> Vista</button>
          <button onClick={() => setActiveTab('CODE')} className={`preview-tab-btn ${activeTab === 'CODE' ? 'active' : ''}`}><Code size={14} /> HTML</button>
        </div>
        
        <div className="flex items-center gap-2">
          {activeTab === 'VISUAL' && (
            <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 shadow-sm">
              <button onClick={() => setTheme('light')} className={`p-1.5 rounded ${theme === 'light' ? 'bg-slate-100' : ''}`} title="Modo Claro"><Sun size={14} className="text-orange-500" /></button>
              <button onClick={() => setTheme('sepia')} className={`p-1.5 rounded ${theme === 'sepia' ? 'bg-[#efe3c5]' : ''}`} title="Modo Sepia"><Coffee size={14} className="text-amber-700" /></button>
              <button onClick={() => setTheme('dark')} className={`p-1.5 rounded ${theme === 'dark' ? 'bg-slate-800' : ''}`} title="Modo Noche"><Moon size={14} className="text-blue-400" /></button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button onClick={() => setIsFullWidth(!isFullWidth)} className="p-1.5 text-slate-500 hover:text-slate-800" title="Alternar Ancho">
                {isFullWidth ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
          )}
          <button onClick={handleDownload} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md" title="Descargar HTML"><Download size={16} /></button>
          <button onClick={() => {
            navigator.clipboard.writeText(html);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            {copied ? '¡Ok!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-auto ${activeTab === 'CODE' ? '