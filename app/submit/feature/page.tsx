'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

export default function SubmitFeaturePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    title: '',
    description: '',
    requester_name: '',
    submission_date: today,
    estimated_size: 'medium',
  });

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white border border-[#E5E5E5] p-10 max-w-md text-center">
            <div className="text-4xl text-plum mb-4 font-bold">✓</div>
            <h2 className="text-2xl font-bold text-black mb-2">Request Submitted</h2>
            <p className="text-[#333333] mb-6">Your feature request has been received and is awaiting review.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => router.push('/')} className="px-5 py-2 border border-[#E5E5E5] text-[#333333] hover:bg-gray-50 rounded font-medium">Home</button>
              <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', requester_name: '', submission_date: today, estimated_size: 'medium' }); }} className="px-5 py-2 bg-plum text-white rounded hover:bg-plum-dark font-bold">Submit Another</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <a href="/" className="text-sm text-plum hover:underline font-medium">← Back to Home</a>
          <h1 className="text-3xl font-bold text-black mt-2">Submit a Feature Request</h1>
          <p className="text-[#333333] mt-1">Describe the feature or enhancement you need.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E5E5] p-6 space-y-5">
          <h2 className="text-base font-bold text-plum border-b border-[#E5E5E5] pb-3">Feature Details</h2>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Feature Title *</label>
            <input required type="text" value={form.title} onChange={(e) => setField('title', e.target.value)}
              className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum" />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">Description *</label>
            <textarea required rows={5} value={form.description} onChange={(e) => setField('description', e.target.value)}
              placeholder="Describe what you need and why it's valuable…"
              className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Your Name *</label>
              <input required type="text" value={form.requester_name} onChange={(e) => setField('requester_name', e.target.value)}
                className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Date *</label>
              <input required type="date" value={form.submission_date} onChange={(e) => setField('submission_date', e.target.value)}
                className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">Estimated Size *</label>
            <select value={form.estimated_size} onChange={(e) => setField('estimated_size', e.target.value)}
              className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum">
              <option value="small">Small – minor change, low effort</option>
              <option value="medium">Medium – moderate change</option>
              <option value="large">Large – significant effort</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => router.push('/')} className="px-6 py-2 border border-[#CCCCCC] rounded text-[#333333] hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-plum text-white rounded hover:bg-plum-dark disabled:opacity-60 font-bold">
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
