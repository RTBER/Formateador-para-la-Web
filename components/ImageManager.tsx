import React from 'react';
import { ImagePlaceholder } from '../types';
import { Image, RectangleHorizontal, Link } from 'lucide-react';

interface ImageManagerProps {
  placeholders: ImagePlaceholder[];
  onUpdateUrl: (id: string, url: string) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ placeholders, onUpdateUrl }) => {
  if (placeholders.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <Image size={18} className="text-brand-600" />
          Imágenes Detectadas ({placeholders.length})
        </h3>
      </div>
      <div className="p-4 space-y-4 max-h-60 overflow-y-auto">
        {placeholders.map((ph, idx) => (
          <div key={ph.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-100">
            <div className="mt-2 text-slate-400">
                {ph.type === 'VERTICAL' ? (
                    <div title="Imagen Vertical (IMAGE)" className="p-1.5 bg-blue-100 text-blue-600 rounded">
                        <Image size={20} />
                    </div>
                ) : (
                    <div title="Imagen Horizontal (IMAGEU)" className="p-1.5 bg-green-100 text-green-600 rounded">
                        <RectangleHorizontal size={20} />
                    </div>
                )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                {ph.type === 'VERTICAL' ? 'Vertical (Sin clase)' : 'Horizontal (Clase: imagen-unica)'} - #{idx + 1}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link size={14} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="https://cdn.sekainovel.com/..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  value={ph.url}
                  onChange={(e) => onUpdateUrl(ph.id, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManager;