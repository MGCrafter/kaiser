"use client";

import { useState, useEffect } from "react";
import {
  fetchHeaderMessages,
  addHeaderMessage,
  updateHeaderMessage,
  deleteHeaderMessage,
} from "../../lib/utils";
import HeaderForm from "./HeaderForm";
import { HeaderMessageData } from "../../types/directus";
import Spinner from "./spinner";
import { toast } from "react-toastify";
import { Edit2, Trash2, Heading } from "lucide-react";

const HeaderTable: React.FC = () => {
  const [headers, setHeaders] = useState<HeaderMessageData[]>([]);
  const [editingHeader, setEditingHeader] = useState<HeaderMessageData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getHeaders() {
      setLoading(true);
      try {
        const data = await fetchHeaderMessages();
        setHeaders(data || []);
      } catch (error) {
        toast.error("Error fetching header messages.");
        console.error("Error fetching headers:", error);
      } finally {
        setLoading(false);
      }
    }
    getHeaders();
  }, []);

  const handleEdit = (header: HeaderMessageData) => {
    setEditingHeader(header);
  };

  const handleDelete = async (id: number, header: string) => {
    const confirmed = window.confirm(`Möchtest du den Header "${header}" wirklich löschen?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteHeaderMessage(id);
      setHeaders(headers.filter(h => h.id !== id));
      toast.success("Header erfolgreich gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Headers.");
      console.error("Error deleting header:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (header: HeaderMessageData) => {
    setLoading(true);
    try {
      if (editingHeader && editingHeader.id) {
        // Update existing header
        const updatedHeader = await updateHeaderMessage(editingHeader.id, header);
        setHeaders(headers.map((h) => (h.id === updatedHeader.id ? updatedHeader : h)));
        setEditingHeader(null);
        toast.success("Header erfolgreich aktualisiert!");
      } else if (headers.length === 0) {
        // Add new header if none exists
        const newHeader = await addHeaderMessage(header);
        setHeaders([newHeader]);
        toast.success("Header erfolgreich hinzugefügt!");
      } else {
        // Show error if a header already exists
        toast.error("Es ist bereits ein Header vorhanden. Nur ein Header ist erlaubt.");
      }
    } catch (error) {
      toast.error("Fehler beim Speichern des Headers.");
      console.error("Error saving header:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingHeader(null);
  };

  return (
    <div className="space-y-6">
      {loading && <Spinner />}

      {/* Form Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingHeader ? "Header bearbeiten" : "Header hinzufügen"}
        </h3>
        <HeaderForm
          editingHeader={editingHeader}
          onFormSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </div>

      {/* Table Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Header
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {headers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Heading className="w-12 h-12 mb-3" />
                      <p className="text-sm">Kein Header vorhanden</p>
                      <p className="text-xs mt-1">Füge deinen Header hinzu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                headers.map((header) => (
                  <tr key={header.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{header.ueberschrift}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(header)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                        {header.id && (
                          <button
                            onClick={() => handleDelete(header.id!, header.ueberschrift)}
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

export default HeaderTable;
