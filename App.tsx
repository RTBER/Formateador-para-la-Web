
import React, { useState, useEffect } from 'react';
import { BookOpenText } from 'lucide-react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ImageManager from './components/ImageManager';
import { detectPlaceholders, convertToHtml } from './utils/converter';
import { proofreadText } from './services/geminiService';
import { ImagePlaceholder } from './types';

function App() {
  const [text, setText] = useState<string>(() => {
    const saved = localStorage.getItem('sekai-editor-text');
    return saved || `Este es el primer párrafo del capítulo. 

IMAGE

Otro párrafo que describe la imagen anterior.

◇ ◆ ◇ ◆ ◇

IMAGEU

Final del capítulo.`;
  });

  const [images, setImages] = useState<ImagePlaceholder[]>(() => {
    const saved = localStorage.getItem('sekai-editor-images');
    return saved ? JSON.parse(saved) : [];
  });

  const [wordGoal, setWordGoal] = useState<number>(() => {
    const saved = localStorage.getItem('sekai-editor-goal');
    return saved ? parseInt(saved) : 2000;
  });

  const [outputHtml, setOutputHtml] = useState<string>('');
  const [isPolishing, setIsPolishing] = useState(false);

  useEffect(() => {
    localStorage.setItem('sekai-editor-text', text);
    localStorage.setItem('sekai-editor-goal', wordGoal.toString());
  }, [text, wordGoal]);

  useEffect(() => {
    localStorage.setItem('sekai-editor-images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    const newPlaceholders = detectPlaceholders(text);
    setImages(prevImages => {
      return newPlaceholders.map((newPh, idx) => {
        const existing = prevImages.find(img => img.type === newPh.type && prevImages.indexOf(img) === idx);
        return { ...newPh, url: existing?.url || '' };
      });
    });
  }, [text]);

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
      alert("Error al conectar con la IA. Verifica tu conexión.");
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500 rounded-lg text-white">
              <BookOpenText size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sekai Novel Formatter</h1>
              <p className="text-xs text-slate-500">Editor Pro v1.2</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[10px] font-bold text-green-600 uppercase">Auto-guardado activo</div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex flex-col h-full gap-6 overflow-hidden">
          <div className="flex-1 min-h-0">
            <Editor 
                value={text} 
                onChange={setText} 
                onAiPolish={handleAiPolish}
                isPolishing={isPolishing}
                wordGoal={wordGoal}
                onSetGoal={setWordGoal}
            />
          </div>
          {images.length > 0 && (
            <div className="flex-none">
                <ImageManager placeholders={images} onUpdateUrl={handleUpdateImageUrl} />
            </div>
          )}
        </div>

        <div className="flex flex-col h-full overflow-hidden">
            <Preview html={outputHtml} />
        </div>
      </main>
    </div>
  );
}

export default App;
