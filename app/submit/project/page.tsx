'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EMPTY_KR = { key_result: '', baseline: '', target: '', measurement_source: '' };

export default function SubmitProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    initiative_name: '',
    submitter_name: '',
    submission_date: today,
    problem_today: '',
    problem_why_now: '',
    problem_who_impacted: '',
    business_objective: '',
    key_results: [
      { ...EMPTY_KR },
      { ...EMPTY_KR },
      { ...EMPTY_KR },
      { ...EMPTY_KR },
    ],
  });

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setKr(index: number, field: string, value: string) {
    setForm((f) => {
      const krs = [...f.key_results];
      krs[index] = { ...krs[index], [field]: value };
      return { ...f, key_results: krs };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      key_results: form.key_results.filter((kr) => kr.key_result.trim() !== ''),
    };

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-10 max-w-md text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Request Submitted</h2>
          <p className="text-gray-500 mb-6">Your project OKR has been received and is awaiting review.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/')} className="px-5 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">
              Home
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ initiative_name: '', submitter_name: '', submission_date: today, problem_today: '', problem_why_now: '', problem_who_impacted: '', business_objective: '', key_results: [{ ...EMPTY_KR }, { ...EMPTY_KR }, { ...EMPTY_KR }, { ...EMPTY_KR }] }); }} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 hover:underline">← Back to Home</a>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Submit a Project</h1>
          <p className="text-gray-500 mt-1">Complete the OKR form below. All fields marked * are required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Initiative Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initiative Name *</label>
              <input
                required
                type="text"
                value={form.initiative_name}
                onChange={(e) => setField('initiative_name', e.target.value)}
                placeholder="OKR – Name of Initiative"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  required
                  type="text"
                  value={form.submitter_name}
                  onChange={(e) => setField('submitter_name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  required
                  type="date"
                  value={form.submission_date}
                  onChange={(e) => setField('submission_date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Problem Statement or Opportunity</h2>
              <p className="text-sm text-gray-500 mt-1">Clearly describe the problem to be solved or the opportunity to be unlocked.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What is happening today? *</label>
              <textarea
                required
                rows={3}
                value={form.problem_today}
                onChange={(e) => setField('problem_today', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Why is this a problem now? *</label>
              <textarea
                required
                rows={3}
                value={form.problem_why_now}
                onChange={(e) => setField('problem_why_now', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Who is impacted? *</label>
              <textarea
                required
                rows={2}
                value={form.problem_who_impacted}
                onChange={(e) => setField('problem_who_impacted', e.target.value)}
                placeholder="Customers, internal teams, revenue, risk, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Business Objective */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Business Objective</h2>
              <p className="text-sm text-gray-500 mt-1">State the single, high-level objective this change aims to achieve. Should be qualitative, customer- or business-focused, and inspiring.</p>
            </div>
            <textarea
              required
              rows={3}
              value={form.business_objective}
              onChange={(e) => setField('business_objective', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Key Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Key Results</h2>
              <p className="text-sm text-gray-500 mt-1">Define measurable outcomes that prove the objective has been achieved. Must be specific, time-bound, and quantifiable.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-8">#</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Key Result</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-36">Baseline (Current)</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-36">Target (Success)</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-36">Measurement Source</th>
                  </tr>
                </thead>
                <tbody>
                  {form.key_results.map((kr, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2 text-gray-400 font-medium">{i + 1}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.key_result}
                          onChange={(e) => setKr(i, 'key_result', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.baseline}
                          onChange={(e) => setKr(i, 'baseline', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.target}
                          onChange={(e) => setKr(i, 'target', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.measurement_source}
                          onChange={(e) => setKr(i, 'measurement_source', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3 pb-10">
            <button type="button" onClick={() => router.push('/')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
