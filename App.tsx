
import React, { useState, useEffect } from 'react';
import { BookOpenText } from 'lucide-react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ImageManager from './components/ImageManager';
import { detectPlaceholders, convertToHtml } from './utils/converter';
import { proofreadText } from './services/geminiService';
import { ImagePlaceholder } from './types';

function App() {
  // Load initial state from localStorage or use default
  const [text, setText] = useState<string>(() => {
    const saved = localStorage.getItem('sekai-editor-text');
    return saved || `Este es el primer párrafo del capítulo. La historia comienza en un bosque oscuro donde el protagonista camina solo.

IMAGE

Otro párrafo que describe la imagen anterior.

◇ ◆ ◇ ◆ ◇

Más texto después del separador.

IMAGEU

Final del capítulo.`;
  });

  const [images, setImages] = useState<ImagePlaceholder[]>(() => {
    const saved = localStorage.getItem('sekai-editor-images');
    return saved ? JSON.parse(saved) : [];
  });

  const [outputHtml, setOutputHtml] = useState<string>('');
  const [isPolishing, setIsPolishing] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('sekai-editor-text', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('sekai-editor-images', JSON.stringify(images));
  }, [images]);

  // Analyze text for placeholders whenever it changes
  useEffect(() => {
    const newPlaceholders = detectPlaceholders(text);
    
    setImages(prevImages => {
      return newPlaceholders.map((newPh, idx) => {
        const existing = prevImages[idx];
        if (existing && existing.type === newPh.type) {
          return { ...newPh, url: existing.url };
        }
        return newPh;
      });
    });
  }, [text]);

  // Generate HTML whenever text or images change
  useEffect(() => {
    const html = convertToHtml(text, images);
    setOutputHtml(html);
  }, [text, images]);

  const handleUpdateImageUrl = (id: string, url: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, url } : img));
  };

  const handleAiPolish = async () => {
    setIsPolishing(true);
    try {
      const corrected = await proofreadText(text);
      setText(corrected);
    } catch (e) {
      alert("Error al conectar con la IA. Verifica tu API Key o intenta más tarde.");
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500 rounded-lg text-white">
              <BookOpenText size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sekai Novel Formatter</h1>
              <p className="text-xs text-slate-500">Herramienta de maquetación profesional</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Auto-guardado activo</div>
              <div className="text-[10px] text-slate-400 font-mono italic">Progreso guardado en local</div>
            </div>
            <div className="text-xs text-slate-400 font-mono">v1.1.0</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Column: Input */}
        <div className="flex flex-col h-full gap-6 overflow-hidden">
          <div className="flex-1 min-h-0">
            <Editor 
                value={text} 
                onChange={setText} 
                onAiPolish={handleAiPolish}
                isPolishing={isPolishing}
            />
          </div>
          {images.length > 0 && (
            <div className="flex-none">
                <ImageManager placeholders={images} onUpdateUrl={handleUpdateImageUrl} />
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col h-full overflow-hidden">
            <Preview html={outputHtml} />
        </div>

      </main>
    </div>
  );
}

export default App;
