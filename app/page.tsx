import Link from 'next/link';
import Header from './components/Header';

export default function HomePage() {
  const submitOptions = [
    {
      href: '/submit/project',
      label: 'Submit a Project',
      description: 'Full OKR form for strategic initiatives',
      colour: 'border-[#E5E5E5] hover:border-plum hover:bg-plum-light',
      badge: 'Project',
      badgeColour: 'bg-plum-light text-plum',
    },
    {
      href: '/submit/feature',
      label: 'Submit a Feature Request',
      description: 'Smaller enhancements or improvements',
      colour: 'border-[#E5E5E5] hover:border-[#CCCCCC] hover:bg-gray-50',
      badge: 'Feature',
      badgeColour: 'bg-[#E5E5E5] text-[#333333]',
    },
    {
      href: '/submit/support',
      label: 'Log a Production Issue',
      description: 'Report a production problem needing resolution',
      colour: 'border-[#E5E5E5] hover:border-red-300 hover:bg-red-50',
      badge: 'Support',
      badgeColour: 'bg-red-100 text-red-700',
    },
    {
      href: '/submit/bau',
      label: 'Log a BAU Item',
      description: 'Record ongoing business-as-usual activity',
      colour: 'border-[#E5E5E5] hover:border-[#CCCCCC] hover:bg-gray-50',
      badge: 'BAU',
      badgeColour: 'bg-[#E5E5E5] text-[#333333]',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-2">Submit a Request</h2>
          <p className="text-[#333333] max-w-xl">Select the type of request below. Your submission will be reviewed by the PM team and tracked on the roadmap.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {submitOptions.map((o) => (
            <Link key={o.href} href={o.href}
              className={`block bg-white border-2 rounded p-6 transition-colors ${o.colour}`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded ${o.badgeColour}`}>{o.badge}</span>
                <span className="text-[#333333] text-lg">→</span>
              </div>
              <p className="font-bold text-black text-lg mb-1">{o.label}</p>
              <p className="text-sm text-[#333333]">{o.description}</p>
            </Link>
          ))}
        </div>

        {/* Roadmap CTA */}
        <div className="bg-white border border-[#E5E5E5] rounded p-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-black">View the full roadmap</h3>
            <p className="text-sm text-[#333333] mt-1">See all projects, features, support items and BAU activity.</p>
          </div>
          <Link href="/roadmap" className="px-5 py-2.5 bg-plum text-white text-sm font-bold rounded hover:bg-plum-dark">
            Open Roadmap →
          </Link>
        </div>
      </main>
    </div>
  );
}
