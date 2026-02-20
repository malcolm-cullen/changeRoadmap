'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white border border-[#E5E5E5] p-10 max-w-md text-center">
            <div className="text-4xl text-plum mb-4 font-bold">✓</div>
            <h2 className="text-2xl font-bold text-black mb-2">Request Submitted</h2>
            <p className="text-[#333333] mb-6">Your project OKR has been received and is awaiting review.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => router.push('/')} className="px-5 py-2 border border-[#E5E5E5] text-[#333333] hover:bg-gray-50 rounded font-medium">
                Home
              </button>
              <button onClick={() => { setSubmitted(false); setForm({ initiative_name: '', submitter_name: '', submission_date: today, problem_today: '', problem_why_now: '', problem_who_impacted: '', business_objective: '', key_results: [{ ...EMPTY_KR }, { ...EMPTY_KR }, { ...EMPTY_KR }, { ...EMPTY_KR }] }); }} className="px-5 py-2 bg-plum text-white rounded hover:bg-plum-dark font-bold">
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <a href="/" className="text-sm text-plum hover:underline font-medium">← Back to Home</a>
          <h1 className="text-3xl font-bold text-black mt-2">Submit a Project</h1>
          <p className="text-[#333333] mt-1">Complete the OKR form below. All fields marked * are required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Initiative Details */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
            <h2 className="text-base font-bold text-plum border-b border-[#E5E5E5] pb-3">Initiative Details</h2>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Initiative Name *</label>
              <input
                required
                type="text"
                value={form.initiative_name}
                onChange={(e) => setField('initiative_name', e.target.value)}
                placeholder="OKR – Name of Initiative"
                className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Your Name *</label>
                <input
                  required
                  type="text"
                  value={form.submitter_name}
                  onChange={(e) => setField('submitter_name', e.target.value)}
                  className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Date *</label>
                <input
                  required
                  type="date"
                  value={form.submission_date}
                  onChange={(e) => setField('submission_date', e.target.value)}
                  className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum"
                />
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-plum">Problem Statement or Opportunity</h2>
              <p className="text-sm text-[#333333] mt-1">Clearly describe the problem to be solved or the opportunity to be unlocked.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">What is happening today? *</label>
              <textarea
                required
                rows={3}
                value={form.problem_today}
                onChange={(e) => setField('problem_today', e.target.value)}
                className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Why is this a problem now? *</label>
              <textarea
                required
                rows={3}
                value={form.problem_why_now}
                onChange={(e) => setField('problem_why_now', e.target.value)}
                className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Who is impacted? *</label>
              <textarea
                required
                rows={2}
                value={form.problem_who_impacted}
                onChange={(e) => setField('problem_who_impacted', e.target.value)}
                placeholder="Customers, internal teams, revenue, risk, etc."
                className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum resize-none"
              />
            </div>
          </div>

          {/* Business Objective */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-plum">Business Objective</h2>
              <p className="text-sm text-[#333333] mt-1">State the single, high-level objective this change aims to achieve. Should be qualitative, customer- or business-focused, and inspiring.</p>
            </div>
            <textarea
              required
              rows={3}
              value={form.business_objective}
              onChange={(e) => setField('business_objective', e.target.value)}
              className="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum resize-none"
            />
          </div>

          {/* Key Results */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-plum">Key Results</h2>
              <p className="text-sm text-[#333333] mt-1">Define measurable outcomes that prove the objective has been achieved. Must be specific, time-bound, and quantifiable.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#E5E5E5]">
                <thead>
                  <tr className="bg-plum-light">
                    <th className="text-left px-3 py-2 font-bold text-plum w-8">#</th>
                    <th className="text-left px-3 py-2 font-bold text-plum">Key Result</th>
                    <th className="text-left px-3 py-2 font-bold text-plum w-36">Baseline (Current)</th>
                    <th className="text-left px-3 py-2 font-bold text-plum w-36">Target (Success)</th>
                    <th className="text-left px-3 py-2 font-bold text-plum w-36">Measurement Source</th>
                  </tr>
                </thead>
                <tbody>
                  {form.key_results.map((kr, i) => (
                    <tr key={i} className="border-t border-[#E5E5E5]">
                      <td className="px-3 py-2 text-[#333333] font-bold">{i + 1}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.key_result}
                          onChange={(e) => setKr(i, 'key_result', e.target.value)}
                          className="w-full border border-[#CCCCCC] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-plum"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.baseline}
                          onChange={(e) => setKr(i, 'baseline', e.target.value)}
                          className="w-full border border-[#CCCCCC] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-plum"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.target}
                          onChange={(e) => setKr(i, 'target', e.target.value)}
                          className="w-full border border-[#CCCCCC] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-plum"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={kr.measurement_source}
                          onChange={(e) => setKr(i, 'measurement_source', e.target.value)}
                          className="w-full border border-[#CCCCCC] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-plum"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3 pb-10">
            <button type="button" onClick={() => router.push('/')} className="px-6 py-2 border border-[#CCCCCC] rounded text-[#333333] hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-plum text-white rounded hover:bg-plum-dark disabled:opacity-60 font-bold">
              {submitting ? 'Submitting…' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
