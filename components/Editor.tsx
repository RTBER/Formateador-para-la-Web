
import React, { useCallback, useState, useRef } from 'react';
import { 
  Sparkles, XCircle, Search, ChevronDown, 
  Replace, ReplaceAll, X, Image as ImageIcon, 
  RectangleHorizontal, Divide, Bold, Italic, Clock,
  Wand2, Target
} from 'lucide-react';
import { fixTypography } from '../utils/typography';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  onAiPolish: () => void;
  isPolishing: boolean;
  wordGoal: number;
  onSetGoal: (goal: number) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onAiPolish, isPolishing, wordGoal, onSetGoal }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [lastFoundIndex, setLastFoundIndex] = useState(-1);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (textToInsert: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue = value.substring(0, start) + textToInsert + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const wrapText = (before: string, after: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);
  };

  const handleFixTypography = () => {
    onChange(fixTypography(value));
  };

  const findNext = useCallback(() => {
    if (!searchQuery || !textareaRef.current) return;
    const textLower = value.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    let startIndex = textareaRef.current.selectionEnd;
    
    if (lastFoundIndex === -1 || startIndex >= value.length) startIndex = 0;
    
    let nextIndex = textLower.indexOf(searchLower, startIndex);
    if (nextIndex === -1) nextIndex = textLower.indexOf(searchLower, 0);

    if (nextIndex !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(nextIndex, nextIndex + searchQuery.length);
      setLastFoundIndex(nextIndex);
    }
  }, [searchQuery, value, lastFoundIndex]);

  const handleReplaceAll = () => {
    if (!searchQuery) return;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    onChange(value.replace(regex, replaceQuery));
  };

  const wordCount = value.split(/\s+/).filter(Boolean).length;
  const progress = wordGoal > 0 ? Math.min((wordCount / wordGoal) * 100, 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <h2 className="font-semibold text-slate-100 flex items-center gap-2">
          Editor
          {wordGoal > 0 && <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{Math.round(progress)}%</span>}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setShowSearch(!showSearch)} className={`p-1.5 rounded-md transition-colors ${showSearch ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Search size={18} />
          </button>
          <button onClick={onAiPolish} disabled={isPolishing || !value} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/50 rounded-md disabled:opacity-50 transition-colors">
            <Sparkles size={14} />
            {isPolishing ? 'Mejorando...' : 'IA Proofread'}
          </button>
          <button onClick={() => confirm('¿Borrar todo?') && onChange('')} className="p-1.5 text-red-400 hover:bg-red-900/20 rounded-md">
            <XCircle size={18} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-slate-900/50 border-b border-slate-800 overflow-x-auto whitespace-nowrap no-scrollbar">
        <button onClick={() => insertText('\nIMAGE\n')} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-blue-400 bg-blue-900/20 border border-blue-800/30 rounded">
          <ImageIcon size={12} /> IMAGE
        </button>
        <button onClick={() => insertText('\nIMAGEU\n')} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-green-400 bg-green-900/20 border border-green-800/30 rounded">
          <RectangleHorizontal size={12} /> IMAGEU
        </button>
        <button onClick={() => insertText('\n◇ ◆ ◇ ◆ ◇\n')} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-amber-400 bg-amber-900/20 border border-amber-800/30 rounded">
          <Divide size={12} /> SEPARADOR
        </button>
        <div className="w-px h-4 bg-slate-800 mx-2"></div>
        <button onClick={handleFixTypography} className="p-1.5 text-brand-400 hover:bg-slate-800 rounded" title="Auto-limpieza"><Wand2 size={16} /></button>
        <button onClick={() => wrapText('<b>', '</b>')} className="p-1.5 text-slate-400 hover:bg-slate-800 rounded"><Bold size={14} /></button>
        <button onClick={() => wrapText('<i>', '</i>')} className="p-1.5 text-slate-400 hover:bg-slate-800 rounded"><Italic size={14} /></button>
        <div className="w-px h-4 bg-slate-800 mx-2"></div>
        <button onClick={() => {
          const g = prompt("Nueva meta de palabras:", wordGoal.toString());
          if(g) onSetGoal(parseInt(g) || 0);
        }} className="p-1.5 text-slate-400 hover:bg-slate-800 rounded" title="Meta de palabras"><Target size={16} /></button>
      </div>

      {/* Search & Replace Panel */}
      {showSearch && (
        <div className="bg-slate-900 border-b border-slate-800 p-3 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1 text-sm text-slate-200 focus:ring-1 focus:ring-brand-500" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button onClick={findNext} className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors">Siguiente</button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Reemplazar con..." 
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1 text-sm text-slate-200 focus:ring-1 focus:ring-brand-500" 
              value={replaceQuery} 
              onChange={(e) => setReplaceQuery(e.target.value)} 
            />
            <button onClick={handleReplaceAll} className="px-3 py-1 text-xs bg-brand-600 text-white rounded hover:bg-brand-500 transition-colors">Reemplazar Todo</button>
          </div>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-6 resize-none bg-slate-950 focus:outline-none font-mono text-sm text-slate-50 leading-relaxed placeholder-slate-700"
        placeholder="Había una vez..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      
      {/* Footer & Progress */}
      <div className="relative">
        <div className="absolute top-0 left-0 h-[2px] bg-slate-800 w-full">
          <div 
            className={`h-full transition-all duration-700 ${progress >= 100 ? 'bg-green-500' : 'bg-brand-500'}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-4 py-3 bg-slate-900 text-[10px] text-slate-500 flex justify-between items-center">
          <div className="flex gap-4">
            <span>Palabras: <span className={progress >= 100 ? 'text-green-400 font-bold' : 'text-slate-300'}>{wordCount}</span> / {wordGoal}</span>
            <span>Caracteres: <span className="text-slate-300">{value.length}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>~{Math.ceil(wordCount / 225)} min de lectura</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
