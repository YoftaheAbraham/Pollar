import Link from 'next/link'
import React from 'react'

const BoardingUI = () => {
    return (
        <section className="relative overflow-hidden border-b border-white/10 bg-black">
            {/* Blurred gradient background - now smaller and more white */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-30 blur-[80px] rounded-full"></div>
                <div className="absolute -bottom-[300px] -right-[300px] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-30 blur-[80px] rounded-full"></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-4 py-40">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl md:text-7xl font-bold mb-8">
                        Data-Driven Decisions
                        <br />Made Simple
                    </h1>
                    <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto">
                        Professional polling infrastructure for enterprises and teams that demand accuracy.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/create-poll" className="px-8 py-4 bg-green-600 text-white hover:bg-orange-700 rounded-sm text-lg font-semibold transition duration-300">
                            Get Started For Free
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BoardingUI