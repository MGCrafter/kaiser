// components/LinkForm.tsx
import { useState, useEffect } from 'react';
import { LinkData } from '../../types/directus';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
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
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm ${
            urlError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
          }`}
        />
        {urlError && (
          <p className="mt-1 text-sm text-red-600">{urlError}</p>
        )}
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {editingLink ? 'Update Link' : 'Add Link'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LinkForm;
