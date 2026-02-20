import Link from 'next/link';

export default function HomePage() {
  const submitOptions = [
    {
      href: '/submit/project',
      label: 'Submit a Project',
      description: 'Full OKR form for strategic initiatives',
      colour: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
      badge: 'Project',
      badgeColour: 'bg-blue-100 text-blue-700',
    },
    {
      href: '/submit/feature',
      label: 'Submit a Feature Request',
      description: 'Smaller enhancements or improvements',
      colour: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50',
      badge: 'Feature',
      badgeColour: 'bg-purple-100 text-purple-700',
    },
    {
      href: '/submit/support',
      label: 'Log a Production Issue',
      description: 'Report a production problem needing resolution',
      colour: 'border-red-200 hover:border-red-400 hover:bg-red-50',
      badge: 'Support',
      badgeColour: 'bg-red-100 text-red-700',
    },
    {
      href: '/submit/bau',
      label: 'Log a BAU Item',
      description: 'Record ongoing business-as-usual activity',
      colour: 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
      badge: 'BAU',
      badgeColour: 'bg-gray-100 text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Change Roadmap</h1>
            <p className="text-sm text-gray-500">Technology Portfolio &amp; Delivery</p>
          </div>
          <Link href="/roadmap" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            View Roadmap
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit a Request</h2>
          <p className="text-gray-500 max-w-xl">Select the type of request below. Your submission will be reviewed by the PM team and tracked on the roadmap.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {submitOptions.map((o) => (
            <Link key={o.href} href={o.href}
              className={`block bg-white border-2 rounded-xl p-6 transition-all ${o.colour}`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.badgeColour}`}>{o.badge}</span>
                <span className="text-gray-400 text-lg">→</span>
              </div>
              <p className="font-semibold text-gray-900 text-lg mb-1">{o.label}</p>
              <p className="text-sm text-gray-500">{o.description}</p>
            </Link>
          ))}
        </div>

        {/* Roadmap CTA */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">View the full roadmap</h3>
            <p className="text-sm text-gray-500 mt-1">See all projects, features, support items and BAU activity.</p>
          </div>
          <Link href="/roadmap" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            Open Roadmap →
          </Link>
        </div>
      </main>
    </div>
  );
}
