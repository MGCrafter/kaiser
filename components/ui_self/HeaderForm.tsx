import React, { useState, useEffect } from 'react';
import { HeaderMessageData } from '../../types/directus';
import { Save, X } from 'lucide-react';

interface HeaderFormProps {
  editingHeader: HeaderMessageData | null;
  onFormSubmit: (header: HeaderMessageData) => void;
  onCancel: () => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({ editingHeader, onFormSubmit, onCancel }) => {
  const [headerText, setHeaderText] = useState('');

  useEffect(() => {
    if (editingHeader) {
      setHeaderText(editingHeader.ueberschrift); // Änderung hier
    } else {
      setHeaderText('');
    }
  }, [editingHeader]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit({ ueberschrift: headerText }); // Änderung hier
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="header" className="block text-sm font-medium text-gray-300 mb-2">
          Seitentitel
        </label>
        <input
          type="text"
          id="header"
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          placeholder="z.B. Mein Name"
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingHeader ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
        {editingHeader && (
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

export default HeaderForm;
