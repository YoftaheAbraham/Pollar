import Link from 'next/link';
import React from 'react'

const HomePage = () => {
  // Mock data
  const livePolls = [
    { id: 1, question: "Best JavaScript Framework?", votes: 1245, options: ["React", "Vue", "Svelte"] },
    { id: 2, question: "Should we add dark mode?", votes: 892, options: ["Yes", "No"] },
    { id: 3, question: "Favorite programming language?", votes: 1567, options: ["TypeScript", "Python", "Go", "Rust"] },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="container mx-auto p-8 text-center min-h-[60vh] flex flex-col justify-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Real-Time Opinion Pulse
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Create lightning-fast polls. Watch results live as votes pour in.
          </p>
          <Link href={'/create-poll'} className="cursor-pointer px-8 py-3 border border-white text-white rounded-sm text-lg font-medium hover:bg-white/90 hover:text-black transition">
            Start Polling →
          </Link>
        </div>
      </section>

      {/* Live Polls */}
      <section className="container mx-auto p-8">
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-white/20">Active Polls</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {livePolls.map((poll) => (
            <div key={poll.id} className="border border-white/20 rounded-lg p-6 hover:border-white/40 transition">
              <h4 className="text-xl font-semibold mb-4">{poll.question}</h4>
              
              <div className="space-y-3 mb-4">
                {poll.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-white rounded-sm"></div>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-full bg-white/10 h-1.5 mb-2">
                <div 
                  className="bg-white h-1.5" 
                  style={{ width: `${Math.min(100, (poll.votes / 2000) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>{poll.options.length} options</span>
                <span>{poll.votes.toLocaleString()} votes</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/20 py-16">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to launch your poll?</h3>
          <Link href={'/create-poll'} className="px-8 cursor-pointer py-3 border-2 border-white rounded-lg text-lg font-medium hover:bg-white/10 transition">
            Create Poll in 30 Seconds
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 p-6 text-center text-white/60 text-sm">
        <p>© {new Date().getFullYear()} Pollar. Zero bullshit, just votes.</p>
      </footer>
    </div>
  )
}

export default HomePage