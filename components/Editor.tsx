import React, { useCallback } from 'react';
import { Sparkles, XCircle } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  onAiPolish: () => void;
  isPolishing: boolean;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onAiPolish, isPolishing }) => {
  const handleClear = useCallback(() => {
    if (confirm('¿Estás seguro de que quieres borrar todo el texto?')) {
      onChange('');
    }
  }, [onChange]);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <h2 className="font-semibold text-slate-100">Editor de Entrada</h2>
        <div className="flex gap-2">
          <button
            onClick={onAiPolish}
            disabled={isPolishing || !value}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/50 rounded-md transition-colors disabled:opacity-50"
          >
            <Sparkles size={14} />
            {isPolishing ? 'Mejorando...' : 'Corregir con IA'}
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-900/40 hover:bg-red-900/60 border border-red-700/50 rounded-md transition-colors"
          >
            <XCircle size={14} />
            Borrar
          </button>
        </div>
      </div>
      <textarea
        className="flex-1 w-full p-4 resize-none bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-mono text-sm text-slate-50 leading-relaxed placeholder-slate-600"
        placeholder="Pega aquí el capítulo de la novela...&#10;&#10;Ejemplo:&#10;&#10;Párrafo de introducción...&#10;&#10;IMAGE&#10;&#10;Otro párrafo...&#10;&#10;◇ ◆ ◇ ◆ ◇&#10;&#10;IMAGEU"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
        Tokens soportados: <b className="text-slate-200">IMAGE</b> (Vertical), <b className="text-slate-200">IMAGEU</b> (Horizontal), <b className="text-slate-200">◇ ◆ ◇ ◆ ◇</b> (Separador)
      </div>
    </div>
  );
};

export default Editor;