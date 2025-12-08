// components/ui_self/WelcomeForm.tsx
import { useState, useEffect } from 'react';
import { WelcomeMessageData } from '../../types/directus';
import { Save, X } from 'lucide-react';

interface WelcomeFormProps {
  editingMessage: WelcomeMessageData | null;
  onFormSubmit: (welcome: WelcomeMessageData) => void;
  onCancel: () => void;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({ editingMessage, onFormSubmit, onCancel }) => {
  const [welcome, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.welcome);
    } else {
      setMessage('');
    }
  }, [editingMessage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (welcome.trim()) {
      setError('');
      onFormSubmit({ welcome });
    } else {
      setError('Bitte geben Sie eine Nachricht ein.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="welcome" className="block text-sm font-medium text-gray-300 mb-2">
          Welcome-Nachricht
        </label>
        <textarea
          id="welcome"
          value={welcome}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="z.B. Willkommen auf meiner Seite!"
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingMessage ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
        {editingMessage && (
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

export default WelcomeForm;
