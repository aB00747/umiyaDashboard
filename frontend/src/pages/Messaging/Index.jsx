import { useState, useEffect } from 'react';
import { messagesAPI } from '../../api/messaging';
import { formatDateTime, classNames } from '../../utils/format';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Plus, X, Send, Mail, MailOpen } from 'lucide-react';
import client from '../../api/client';

export default function Messaging() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ recipient: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const { data } = await messagesAPI.list();
      setMessages(data.results || data || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  async function viewMessage(msg) {
    try {
      const { data } = await messagesAPI.get(msg.id);
      setSelected(data);
      if (!msg.is_read && msg.recipient === user?.id) {
        await messagesAPI.markRead(msg.id);
        setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
      }
    } catch {
      toast.error('Failed to load message');
    }
  }

  async function openCompose() {
    try {
      const { data } = await client.get('/auth/me/');
      setUsers([]);
    } catch { /* ignore */ }
    setForm({ recipient: '', subject: '', body: '' });
    setComposeOpen(true);
  }

  async function handleSend(e) {
    e.preventDefault();
    setSending(true);
    try {
      await messagesAPI.create(form);
      toast.success('Message sent');
      setComposeOpen(false);
      loadMessages();
    } catch {
      toast.error('Send failed');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messaging</h1>
        <button onClick={openCompose} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Compose
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Message list */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Inbox</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 dark:text-gray-400 text-center">No messages</p>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => viewMessage(msg)}
                  className={classNames(
                    'w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                    selected?.id === msg.id && 'bg-indigo-50 dark:bg-indigo-900/30',
                    !msg.is_read && 'bg-blue-50/50 dark:bg-blue-900/20'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {msg.is_read ? <MailOpen className="h-4 w-4 text-gray-400" /> : <Mail className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />}
                    <span className={classNames('text-sm', !msg.is_read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300')}>
                      {msg.sender_name || `User #${msg.sender}`}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatDateTime(msg.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {selected ? (
            <div>
              <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selected.subject}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>From: <span className="font-medium text-gray-700 dark:text-gray-300">{selected.sender_name || `User #${selected.sender}`}</span></span>
                  <span>To: <span className="font-medium text-gray-700 dark:text-gray-300">{selected.recipient_name || `User #${selected.recipient}`}</span></span>
                  <span>{formatDateTime(selected.created_at)}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selected.body}</p>
              </div>
              {selected.replies && selected.replies.length > 0 && (
                <div className="px-5 pb-5 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Replies</h4>
                  {selected.replies.map((r) => (
                    <div key={r.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{r.sender_name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(r.created_at)}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-sm">
              Select a message to read
            </div>
          )}
        </div>
      </div>

      {/* Compose */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg m-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Message</h3>
              <button onClick={() => setComposeOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X className="h-5 w-5 text-gray-500 dark:text-gray-400" /></button>
            </div>
            <form onSubmit={handleSend} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient User ID *</label>
                <input type="number" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} placeholder="Enter user ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                <input type="text" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                <textarea required rows={5} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setComposeOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={sending} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                  <Send className="h-4 w-4" /> {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
