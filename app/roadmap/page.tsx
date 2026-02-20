'use client';

import { useEffect, useState } from 'react';

type KeyResult = {
  id: number;
  row_number: number;
  key_result: string;
  baseline: string;
  target: string;
  measurement_source: string;
};

type Project = {
  id: number;
  initiative_name: string;
  submitter_name: string;
  submission_date: string;
  problem_today: string;
  business_objective: string;
  status: string;
  priority: string | null;
  pm_notes: string | null;
  key_results: KeyResult[];
  type: 'project';
};

type Feature = {
  id: number;
  title: string;
  description: string;
  requester_name: string;
  submission_date: string;
  estimated_size: string;
  status: string;
  priority: string | null;
  pm_notes: string | null;
  type: 'feature';
};

type Support = {
  id: number;
  title: string;
  description: string;
  submitter_name: string;
  submission_date: string;
  severity: string;
  affected_system: string;
  status: string;
  pm_notes: string | null;
  type: 'support';
};

type BauItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  submitter_name: string;
  submission_date: string;
  status: string;
  pm_notes: string | null;
  type: 'bau';
};

type RoadmapData = {
  projects: Project[];
  features: Feature[];
  support: Support[];
  bau: BauItem[];
};

const STATUS_COLOURS: Record<string, string> = {
  submitted: 'bg-gray-100 text-gray-600',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  on_hold: 'bg-orange-100 text-orange-700',
};

const PRIORITY_COLOURS: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const SEVERITY_COLOURS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

function Badge({ label, colour }: { label: string; colour: string }) {
  return <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${colour}`}>{label.replace('_', ' ')}</span>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RoadmapPage() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'features' | 'support' | 'bau'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/roadmap').then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading roadmap…</div>;
  }

  const tabs = [
    { key: 'all', label: 'All', count: data.projects.length + data.features.length + data.support.length + data.bau.length },
    { key: 'projects', label: 'Projects', count: data.projects.length },
    { key: 'features', label: 'Feature Requests', count: data.features.length },
    { key: 'support', label: 'Production Support', count: data.support.length },
    { key: 'bau', label: 'BAU', count: data.bau.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm text-blue-600 hover:underline">← Back to Home</a>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Roadmap</h1>
            <p className="text-gray-500 mt-1">All submitted requests and active work items.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
              {t.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === t.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Projects */}
          {(activeTab === 'all' || activeTab === 'projects') && (
            <>
              {activeTab === 'all' && data.projects.length > 0 && <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-6 mb-2">Projects</h2>}
              {data.projects.length === 0 && activeTab === 'projects' && <EmptyState label="No projects submitted yet." />}
              {data.projects.map((p) => {
                const key = `project-${p.id}`;
                const open = expandedId === key;
                return (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button className="w-full text-left px-6 py-4 flex items-start justify-between gap-4" onClick={() => setExpandedId(open ? null : key)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Project</span>
                          {p.priority && <Badge label={p.priority} colour={PRIORITY_COLOURS[p.priority] || ''} />}
                          <Badge label={p.status} colour={STATUS_COLOURS[p.status] || ''} />
                        </div>
                        <p className="font-semibold text-gray-900 truncate">{p.initiative_name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{p.submitter_name} · {formatDate(p.submission_date)}</p>
                      </div>
                      <span className="text-gray-400 text-lg mt-1">{open ? '▲' : '▼'}</span>
                    </button>
                    {open && (
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                        {p.business_objective && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Business Objective</p>
                            <p className="text-sm text-gray-700">{p.business_objective}</p>
                          </div>
                        )}
                        {p.problem_today && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Problem Today</p>
                            <p className="text-sm text-gray-700">{p.problem_today}</p>
                          </div>
                        )}
                        {p.key_results.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Key Results</p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border border-gray-100 rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left px-3 py-2 text-gray-500 font-medium w-8">#</th>
                                    <th className="text-left px-3 py-2 text-gray-500 font-medium">Key Result</th>
                                    <th className="text-left px-3 py-2 text-gray-500 font-medium">Baseline</th>
                                    <th className="text-left px-3 py-2 text-gray-500 font-medium">Target</th>
                                    <th className="text-left px-3 py-2 text-gray-500 font-medium">Measure</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {p.key_results.map((kr) => (
                                    <tr key={kr.id} className="border-t border-gray-100">
                                      <td className="px-3 py-2 text-gray-400">{kr.row_number}</td>
                                      <td className="px-3 py-2 text-gray-700">{kr.key_result}</td>
                                      <td className="px-3 py-2 text-gray-500">{kr.baseline}</td>
                                      <td className="px-3 py-2 text-gray-500">{kr.target}</td>
                                      <td className="px-3 py-2 text-gray-500">{kr.measurement_source}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        {p.pm_notes && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1">PM Notes</p>
                            <p className="text-sm text-blue-800">{p.pm_notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Features */}
          {(activeTab === 'all' || activeTab === 'features') && (
            <>
              {activeTab === 'all' && data.features.length > 0 && <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-6 mb-2">Feature Requests</h2>}
              {data.features.length === 0 && activeTab === 'features' && <EmptyState label="No feature requests submitted yet." />}
              {data.features.map((f) => {
                const key = `feature-${f.id}`;
                const open = expandedId === key;
                return (
                  <div key={f.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button className="w-full text-left px-6 py-4 flex items-start justify-between gap-4" onClick={() => setExpandedId(open ? null : key)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Feature</span>
                          <span className="text-xs text-gray-500 capitalize">{f.estimated_size}</span>
                          {f.priority && <Badge label={f.priority} colour={PRIORITY_COLOURS[f.priority] || ''} />}
                          <Badge label={f.status} colour={STATUS_COLOURS[f.status] || ''} />
                        </div>
                        <p className="font-semibold text-gray-900 truncate">{f.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{f.requester_name} · {formatDate(f.submission_date)}</p>
                      </div>
                      <span className="text-gray-400 text-lg mt-1">{open ? '▲' : '▼'}</span>
                    </button>
                    {open && (
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                        <p className="text-sm text-gray-700">{f.description}</p>
                        {f.pm_notes && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1">PM Notes</p>
                            <p className="text-sm text-blue-800">{f.pm_notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Support */}
          {(activeTab === 'all' || activeTab === 'support') && (
            <>
              {activeTab === 'all' && data.support.length > 0 && <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-6 mb-2">Production Support</h2>}
              {data.support.length === 0 && activeTab === 'support' && <EmptyState label="No production support items logged." />}
              {(data.support as Support[]).map((s) => {
                const key = `support-${s.id}`;
                const open = expandedId === key;
                return (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button className="w-full text-left px-6 py-4 flex items-start justify-between gap-4" onClick={() => setExpandedId(open ? null : key)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Support</span>
                          <Badge label={s.severity} colour={SEVERITY_COLOURS[s.severity] || ''} />
                          <Badge label={s.status} colour={STATUS_COLOURS[s.status] || ''} />
                        </div>
                        <p className="font-semibold text-gray-900 truncate">{s.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{s.submitter_name} · {formatDate(s.submission_date)}{s.affected_system ? ` · ${s.affected_system}` : ''}</p>
                      </div>
                      <span className="text-gray-400 text-lg mt-1">{open ? '▲' : '▼'}</span>
                    </button>
                    {open && (
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                        <p className="text-sm text-gray-700">{s.description}</p>
                        {s.pm_notes && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1">PM Notes</p>
                            <p className="text-sm text-blue-800">{s.pm_notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* BAU */}
          {(activeTab === 'all' || activeTab === 'bau') && (
            <>
              {activeTab === 'all' && data.bau.length > 0 && <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-6 mb-2">BAU</h2>}
              {data.bau.length === 0 && activeTab === 'bau' && <EmptyState label="No BAU items logged." />}
              {data.bau.map((b) => {
                const key = `bau-${b.id}`;
                const open = expandedId === key;
                return (
                  <div key={b.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button className="w-full text-left px-6 py-4 flex items-start justify-between gap-4" onClick={() => setExpandedId(open ? null : key)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">BAU</span>
                          {b.category && <span className="text-xs text-gray-500">{b.category}</span>}
                          <Badge label={b.status} colour={STATUS_COLOURS[b.status] || ''} />
                        </div>
                        <p className="font-semibold text-gray-900 truncate">{b.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{b.submitter_name} · {formatDate(b.submission_date)}</p>
                      </div>
                      <span className="text-gray-400 text-lg mt-1">{open ? '▲' : '▼'}</span>
                    </button>
                    {open && (
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                        {b.description && <p className="text-sm text-gray-700">{b.description}</p>}
                        {b.pm_notes && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1">PM Notes</p>
                            <p className="text-sm text-blue-800">{b.pm_notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {(activeTab === 'all') && data.projects.length === 0 && data.features.length === 0 && data.support.length === 0 && data.bau.length === 0 && (
            <EmptyState label="No items on the roadmap yet. Start by submitting a request." />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400 text-sm">
      {label}
    </div>
  );
}
