// components/LinkForm.tsx
import { useState, useEffect } from 'react';
import { LinkData } from '../../types/directus';
import { Save, X } from 'lucide-react';

interface LinkFormProps {
  editingLink: LinkData | null;
  onFormSubmit: (link: LinkData) => void;
  onCancel: () => void;
}

const LinkForm: React.FC<LinkFormProps> = ({ editingLink, onFormSubmit, onCancel }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (editingLink) {
      setUrl(editingLink.url);
      setTitle(editingLink.title);
    } else {
      setUrl('');
      setTitle('');
    }
    setUrlError('');
  }, [editingLink]);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // URL Validierung
    if (!validateUrl(url)) {
      setUrlError('Bitte gib eine gültige URL ein (z.B. https://example.com)');
      return;
    }

    setUrlError('');
    onFormSubmit({ url, title });
    setUrl('');
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Titel
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="z.B. Mein Instagram"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError('');
            }}
            required
            placeholder="https://example.com"
            className={`w-full px-3 py-2 bg-gray-700 border text-white rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              urlError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-blue-500'
            }`}
          />
          {urlError && (
            <p className="mt-1.5 text-sm text-red-400">{urlError}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingLink ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
        {editingLink && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-md transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
};

export default LinkForm;
