import { useState, useEffect } from 'react';
import { settingsAPI, brandingAPI } from '../../api/core';
import { useAuth } from '../../contexts/AuthContext';
import { useBranding } from '../../contexts/BrandingContext';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Upload, Image } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { systemName: currentSystemName, logoUrl: currentLogoUrl, faviconUrl: currentFaviconUrl, refreshBranding } = useBranding();
  const isAdmin = user?.role?.name === 'super_admin' || user?.role?.name === 'admin';

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Branding state
  const [brandingName, setBrandingName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState('');
  const [savingBranding, setSavingBranding] = useState(false);

  useEffect(() => {
    setBrandingName(currentSystemName);
    setLogoPreview(currentLogoUrl);
    setFaviconPreview(currentFaviconUrl);
  }, [currentSystemName, currentLogoUrl, currentFaviconUrl]);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const { data } = await settingsAPI.list();
      setSettings(data.results || data || []);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(setting) {
    try {
      await settingsAPI.update(setting.key, setting);
      toast.success('Setting updated');
    } catch {
      toast.error('Update failed');
    }
  }

  function updateSetting(key, field, value) {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s))
    );
  }

  async function handleAdd() {
    if (!newKey.trim()) return toast.error('Key is required');
    try {
      await client.post('/settings/', { key: newKey, value: newValue, description: newDesc });
      toast.success('Setting added');
      setNewKey('');
      setNewValue('');
      setNewDesc('');
      loadSettings();
    } catch {
      toast.error('Add failed');
    }
  }

  function handleFileSelect(e, setFile, setPreview) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSaveBranding() {
    setSavingBranding(true);
    try {
      const formData = new FormData();
      formData.append('system_name', brandingName);
      if (logoFile) formData.append('logo', logoFile);
      if (faviconFile) formData.append('favicon', faviconFile);
      await brandingAPI.update(formData);
      await refreshBranding();
      setLogoFile(null);
      setFaviconFile(null);
      toast.success('Branding updated');
    } catch {
      toast.error('Failed to update branding');
    } finally {
      setSavingBranding(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Branding Section - admin only */}
      {isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branding</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Name</label>
              <input
                type="text"
                className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={brandingName}
                onChange={(e) => setBrandingName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    <Upload className="h-4 w-4" /> Upload Logo
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, setLogoFile, setLogoPreview)} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Favicon</label>
                <div className="flex items-center gap-4">
                  {faviconPreview ? (
                    <img src={faviconPreview} alt="Favicon" className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    <Upload className="h-4 w-4" /> Upload Favicon
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, setFaviconFile, setFaviconPreview)} />
                  </label>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveBranding}
              disabled={savingBranding}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {savingBranding ? 'Saving...' : 'Save Branding'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Settings</h2>
        <div className="space-y-4">
          {settings.map((s) => (
            <div key={s.key} className="flex items-end gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{s.key}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={s.value}
                  onChange={(e) => updateSetting(s.key, 'value', e.target.value)}
                />
                {s.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.description}</p>}
              </div>
              <button
                onClick={() => handleUpdate(s)}
                className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          ))}
          {settings.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No settings configured</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Setting</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g., company_name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="e.g., Umiya Chemical"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Optional description"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add Setting
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-500 dark:text-gray-400">Backend</span>
            <span className="font-medium text-gray-900 dark:text-white">Django REST Framework</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-500 dark:text-gray-400">Frontend</span>
            <span className="font-medium text-gray-900 dark:text-white">React + Vite</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-500 dark:text-gray-400">Database</span>
            <span className="font-medium text-gray-900 dark:text-white">SQLite</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-500 dark:text-gray-400">Authentication</span>
            <span className="font-medium text-gray-900 dark:text-white">JWT (SimpleJWT)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
