'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitSupportPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    title: '',
    description: '',
    submitter_name: '',
    submission_date: today,
    severity: 'medium',
    affected_system: '',
  });

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-10 max-w-md text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Request Submitted</h2>
          <p className="text-gray-500 mb-6">Your support request has been logged.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/')} className="px-5 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">Home</button>
            <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', submitter_name: '', submission_date: today, severity: 'medium', affected_system: '' }); }} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  const severityColours: Record<string, string> = {
    critical: 'text-red-700 bg-red-50 border-red-200',
    high: 'text-orange-700 bg-orange-50 border-orange-200',
    medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    low: 'text-green-700 bg-green-50 border-green-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 hover:underline">← Back to Home</a>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Log a Production Support Issue</h1>
          <p className="text-gray-500 mt-1">Report a production problem that needs investigation or resolution.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
            <input required type="text" value={form.title} onChange={(e) => setField('title', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
            <div className="grid grid-cols-4 gap-2">
              {['critical', 'high', 'medium', 'low'].map((s) => (
                <button key={s} type="button" onClick={() => setField('severity', s)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${form.severity === s ? severityColours[s] + ' ring-2 ring-offset-1 ring-current' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Affected System</label>
            <input type="text" value={form.affected_system} onChange={(e) => setField('affected_system', e.target.value)}
              placeholder="e.g. Fraud Platform, Payment Gateway…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setField('description', e.target.value)}
              placeholder="Describe the issue, impact, and any steps already taken…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input required type="text" value={form.submitter_name} onChange={(e) => setField('submitter_name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input required type="date" value={form.submission_date} onChange={(e) => setField('submission_date', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => router.push('/')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Log Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
