import Link from 'next/link'
import React from 'react'

const HomePage = () => {
  const features = [
    {
      title: "Enterprise Reliability",
      description: "99.9% uptime with real-time data synchronization across all devices",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Advanced Analytics",
      description: "Real-time charts and demographic breakdowns of your poll results",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Secure Infrastructure",
      description: "End-to-end encryption and compliance for sensitive polls",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Data-Driven Decisions
              <br />Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
              Professional polling infrastructure for enterprises and teams that demand accuracy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/create-poll" className="px-8 py-4 bg-white text-black hover:bg-white/90 rounded-lg text-lg font-semibold transition duration-300">
                Start Free Trial
              </Link>
              <Link href="/demo" className="px-8 py-4 border border-white text-white hover:bg-white/10 rounded-lg text-lg font-semibold transition duration-300">
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-black py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <p className="text-center text-white/60 mb-6">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
            {['TechCorp', 'GlobalEd', 'Fortune 500', 'InnovateX', 'DataSystems'].map((company) => (
              <div key={company} className="text-xl font-light text-white">{company}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <section className="py-20 bg-black border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Professionals Choose Pollar</h2>
            <p className="text-xl text-white/80">
              Enterprise features without the enterprise complexity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300">
                <div className="text-white mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Actionable Insights</h2>
              <p className="text-xl text-white/80 mb-8">
                Our dashboard transforms raw data into visual stories that drive decisions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-white mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Real-time demographic breakdowns</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-white mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Export to CSV, PDF, and PowerPoint</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-white mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Customizable reporting intervals</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 bg-black p-6 rounded-xl border border-white/10">
              {/* Placeholder for analytics chart */}
              <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <div className="text-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-white/60">Interactive Analytics Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Feedback Process?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Join organizations making better decisions with real-time data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing" className="px-8 py-4 bg-white text-black hover:bg-white/70 rounded-sm text-lg font-semibold transition duration-300">
              View Pricing
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-white text-white hover:bg-black/5 rounded-sm text-lg font-semibold transition duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage