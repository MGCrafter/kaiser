// components/ui_self/WelcomeTable.tsx
"use client";

import { useState, useEffect } from 'react';
import {
  fetchWelcomeMessages,
  addWelcomeMessage,
  updateWelcomeMessage,
  deleteWelcomeMessage,
} from '../../lib/utils';
import WelcomeForm from './WelcomeForm';
import { WelcomeMessageData } from '../../types/directus';
import Spinner from './spinner';
import { toast } from 'react-toastify';
import { Edit2, Trash2, MessageSquare } from 'lucide-react';

const WelcomeTable: React.FC = () => {
  const [messages, setMessages] = useState<WelcomeMessageData[]>([]);
  const [editingMessage, setEditingMessage] = useState<WelcomeMessageData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getMessages() {
      setLoading(true);
      try {
        const data = await fetchWelcomeMessages();
        setMessages(data || []);
      } catch (error) {
        toast.error('Fehler beim Abrufen der Nachrichten.');
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    }
    getMessages();
  }, []);

  const handleEdit = (message: WelcomeMessageData) => {
    setEditingMessage(message);
  };

  const handleDelete = async (id: number, message: string) => {
    const confirmed = window.confirm(`Möchtest du die Nachricht "${message}" wirklich löschen?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteWelcomeMessage(id);
      setMessages([]);
      toast.success('Nachricht erfolgreich gelöscht!');
    } catch (error) {
      toast.error('Fehler beim Löschen der Nachricht.');
      console.error('Error deleting message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (message: WelcomeMessageData) => {
    setLoading(true);
    try {
      if (editingMessage && editingMessage.id) {
        // Update existing message
        const updatedMessage = await updateWelcomeMessage(editingMessage.id, message);
        setMessages(messages.map((m) => (m.id === updatedMessage.id ? updatedMessage : m)));
        setEditingMessage(null);
        toast.success('Nachricht erfolgreich aktualisiert!');
      } else if (messages.length === 0) {
        // Add new message if no existing messages
        const newMessage = await addWelcomeMessage(message);
        setMessages([newMessage]);
        toast.success('Nachricht erfolgreich hinzugefügt!');
      } else {
        // Show error if there is already a message
        toast.error('Es ist bereits eine Nachricht vorhanden. Nur eine Nachricht ist erlaubt.');
      }
    } catch (error) {
      toast.error('Fehler beim Speichern der Nachricht.');
      console.error('Error saving message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingMessage(null);
  };

  return (
    <div className="space-y-6">
      {loading && <Spinner />}

      {/* Form Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingMessage ? "Nachricht bearbeiten" : "Welcome-Nachricht hinzufügen"}
        </h3>
        <WelcomeForm editingMessage={editingMessage} onFormSubmit={handleFormSubmit} onCancel={handleCancel} />
      </div>

      {/* Table Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nachricht
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <MessageSquare className="w-12 h-12 mb-3" />
                      <p className="text-sm">Keine Welcome-Nachricht vorhanden</p>
                      <p className="text-xs mt-1">Füge deine Welcome-Nachricht hinzu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{message.welcome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(message)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                        {message.id && (
                          <button
                            onClick={() => handleDelete(message.id!, message.welcome)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTable;
