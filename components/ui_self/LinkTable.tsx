// components/LinkTable.tsx
import { useState, useEffect } from "react";
import { fetchLinks, addLink, updateLink, deleteLink } from "../../lib/utils";
import LinkForm from "./LinkForm";
import { LinkData } from "../../types/directus";
import Spinner from "./spinner";
import { toast } from "react-toastify";
import { Edit2, Trash2, ExternalLink } from "lucide-react";

const LinkTable: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getLinks() {
      setLoading(true);
      try {
        const data = await fetchLinks();
        setLinks(data || []);
      } catch (error) {
        toast.error("Fehler beim Abrufen der Links.");
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    }
    getLinks();
  }, []);

  const handleEdit = (link: LinkData) => {
    setEditingLink(link);
  };

  const handleDelete = async (id: number, title: string) => {
    // Bestätigung vor dem Löschen
    const confirmed = window.confirm(`Möchtest du den Link "${title}" wirklich löschen?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteLink(id);
      setLinks(links.filter((link) => link.id !== id));
      toast.success("Link erfolgreich gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Links.");
      console.error("Error deleting link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (link: LinkData) => {
    setLoading(true);
    try {
      if (editingLink && editingLink.id) {
        const updatedLink = await updateLink(editingLink.id, link);
        setLinks(links.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
        setEditingLink(null);
        toast.success("Link erfolgreich aktualisiert!");
      } else {
        const newLink = await addLink(link);
        setLinks([...links, newLink]);
        toast.success("Link erfolgreich hinzugefügt!");
      }
    } catch (error) {
      toast.error("Fehler beim Speichern des Links.");
      console.error("Error saving link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingLink(null);
  };

  return (
    <div className="space-y-6">
      {loading && <Spinner />}

      {/* Form Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingLink ? "Link bearbeiten" : "Neuen Link hinzufügen"}
        </h3>
        <LinkForm
          editingLink={editingLink}
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
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ExternalLink className="w-12 h-12 mb-3" />
                      <p className="text-sm">Keine Links vorhanden</p>
                      <p className="text-xs mt-1">Füge deinen ersten Link hinzu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id || link.url} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{link.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center group"
                      >
                        <span className="truncate max-w-md">{link.url}</span>
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(link)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                        {link.id && (
                          <button
                            onClick={() => handleDelete(link.id!, link.title)}
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

export default LinkTable;
