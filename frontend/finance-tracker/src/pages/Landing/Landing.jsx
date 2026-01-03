import React, { useRef } from 'react'
import finbugLogo from '../../assets/finbug.png'
import heroVideo from '../../assets/videos/video.mp4'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../../index.css'

const Landing = () => {
    const navigate = useNavigate();
    const contactRef = useRef(null);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const name = formData.get('name') || '';
        const loadingToast = toast.loading('Sending message...');

        try {
            const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                toast.success(`Thanks ${name}! We'll get back to you soon.`, { id: loadingToast });
                form.reset();
            } else {
                toast.error('Failed to send. Please try again.', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Something went wrong.', { id: loadingToast });
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <img src={finbugLogo} alt="FinBug" className="w-10 h-10" />
                    <span className="text-xl font-semibold">FinBug</span>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                    <button onClick={() => navigate('/login')} className="text-sm md:text-base text-gray-600 hover:text-gray-900">Login</button>
                    <button onClick={() => navigate('/signUp')} className="text-sm md:text-base px-4 md:px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Sign Up</button>
                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Your money,<br />finally organized
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                            Stop wondering where your money goes. FinBug helps you track every rupee, understand your spending, and actually stick to your budget.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => navigate('/signUp')} className="px-6 md:px-8 py-3 md:py-4 bg-black text-white rounded-lg hover:bg-gray-800 text-base md:text-lg font-medium">
                                Start tracking free
                            </button>
                            <button onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-6 md:px-8 py-3 md:py-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 text-base md:text-lg font-medium">
                                Get in touch
                            </button>
                        </div>
                        <p className="mt-6 text-sm text-gray-500">No credit card required • Free forever</p>
                    </div>

                    <div className="relative">
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                            <video src={heroVideo} poster={finbugLogo} className="w-full h-full object-cover" autoPlay loop muted playsInline>
                                <img src={finbugLogo} alt="FinBug Demo" className="w-full h-full object-cover" />
                            </video>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 md:mb-16">What makes FinBug different</h2>
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    <div>
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-3">See where it goes</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Beautiful charts that actually make sense. No confusing graphs or complicated reports—just clear insights into your spending.
                        </p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-3">AI does the work</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Stop manually categorizing transactions. Our AI learns your patterns and does it automatically, so you don't have to.
                        </p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-3">Your data is yours</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Bank-level encryption and security. We never sell your data, and you can export or delete it anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-gray-50 py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 md:mb-16">How it works</h2>
                    <div className="space-y-12 md:space-y-16">
                        <div className="flex gap-6 md:gap-8 items-start">
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold">1</div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-2">Add your transactions</h3>
                                <p className="text-gray-600 text-base md:text-lg">Manually add expenses or upload your bank statements. Takes less than a minute.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 md:gap-8 items-start">
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold">2</div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-2">AI categorizes everything</h3>
                                <p className="text-gray-600 text-base md:text-lg">Our AI automatically sorts your spending into categories. You can adjust if needed.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 md:gap-8 items-start">
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold">3</div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-2">Get insights that matter</h3>
                                <p className="text-gray-600 text-base md:text-lg">See trends, set budgets, and get alerts when you're overspending. Simple as that.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
                <div className="bg-black text-white rounded-2xl md:rounded-3xl p-8 md:p-16 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Ready to get started?</h2>
                    <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-300">Join thousands who've taken control of their finances</p>
                    <button onClick={() => navigate('/signUp')} className="px-8 md:px-10 py-4 md:py-5 bg-white text-black rounded-lg hover:bg-gray-100 text-base md:text-lg font-semibold">
                        Start tracking for free
                    </button>
                </div>
            </section>

            {/* Contact */}
            <section ref={contactRef} className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-32">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions? Let's talk</h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">We're here to help. Drop us a message and we'll get back to you.</p>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                    <input type="hidden" name="access_key" value="b527ab92-6d1d-483d-b973-ec67ff5b67bf" />
                    <input type="hidden" name="redirect" value="false" />

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input name="name" placeholder="Your name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input name="email" type="email" placeholder="you@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea name="message" placeholder="Tell us what's on your mind..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-32 resize-none" required />
                    </div>

                    <button type="submit" className="w-full px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold text-base md:text-lg">
                        Send message
                    </button>
                </form>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img src={finbugLogo} alt="FinBug" className="w-8 h-8" />
                        <span className="font-semibold">FinBug</span>
                    </div>
                    <p className="text-sm text-gray-500">© 2025 FinBug. Made with care.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing
