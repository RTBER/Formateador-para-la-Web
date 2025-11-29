import React, { useState } from 'react';
import { Copy, Check, Eye, Code } from 'lucide-react';

interface PreviewProps {
  html: string;
}

const Preview: React.FC<PreviewProps> = ({ html }) => {
  const [activeTab, setActiveTab] = useState<'CODE' | 'VISUAL'>('CODE');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('CODE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'CODE'
                ? 'bg-brand-100 text-brand-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Code size={14} />
            HTML
          </button>
          <button
            onClick={() => setActiveTab('VISUAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'VISUAL'
                ? 'bg-brand-100 text-brand-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Eye size={14} />
            Visual
          </button>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          {copied ? '¡Copiado!' : 'Copiar HTML'}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-slate-900 custom-scrollbar">
        {activeTab === 'CODE' ? (
          <pre className="p-4 text-sm font-mono text-green-400 whitespace-pre-wrap leading-relaxed">
            {html || <span className="text-slate-500 italic">/* El código generado aparecerá aquí */</span>}
          </pre>
        ) : (
            // Visual Preview Area - Simulating the target styles
          <div className="p-6 bg-white min-h-full">
            <style>{`
              .preview-content p { margin-bottom: 1em; line-height: 1.6; color: #333; }
              .preview-content .separador { text-align: center; color: #555; margin: 2rem 0; font-weight: bold; }
              .preview-content img { max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 4px; }
              .preview-content .imagen-unica { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid #eee; }
            `}</style>
            <div 
                className="preview-content max-w-2xl mx-auto"
                dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-400 text-center italic">Vista previa vacía</p>' }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;