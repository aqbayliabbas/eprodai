'use client';
import { useState } from "react";

function FAQSection() {
  const faq = [
    {
      q: "What do I get with EPROD?",
      a: "You get access to our AI-powered platform for generating unlimited, high-quality product images, a library of templates, editing tools, and fast downloads."
    },
    {
      q: "Can I use my own product photos?",
      a: "Yes! You can upload your own product photos and let our AI enhance, edit, or generate new backgrounds and styles for them."
    },
    {
      q: "Is there a refund policy?",
      a: "Absolutely. If you’re not satisfied within 14 days of purchase, contact our support team for a full refund—no questions asked."
    },
    {
      q: "What file formats can I download?",
      a: "You can download your images in popular formats such as JPG and PNG, suitable for web, print, and social media."
    },
    {
      q: "Do I need design skills to use EPROD?",
      a: "Not at all. EPROD is designed for everyone—our AI handles the design work, so you can create professional images with just a few clicks."
    },
    {
      q: "Can I use the images for commercial purposes?",
      a: "Yes, all images you generate with EPROD can be used for your business, marketing, and sales—commercial use is included."
    },
    {
      q: "How fast are images generated?",
      a: "Most images are generated in under a minute, thanks to our advanced AI and optimized cloud infrastructure."
    },
    {
      q: "What if I need help or support?",
      a: "Our support team is here to help! You can reach us anytime via email, and Pro users get priority support."
    },
    {
      q: "Can I upgrade to Pro later?",
      a: "Yes, you can upgrade to EPROD Pro at any time to unlock advanced features and bonuses. Your existing work will be preserved."
    },
    {
      q: "I have another question",
      a: "We’re happy to help! Please contact us and our team will get back to you as soon as possible."
    }
  ];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="w-full max-w-2xl mx-auto">
      {faq.map((item, i) => (
        <div key={item.q} className="py-4 border-b border-[#d1cfc7]">
          <div
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            tabIndex={0}
          >
            <span className="text-base sm:text-lg font-medium text-[#212121]">{item.q}</span>
            <span className={`text-2xl transition ${open === i ? 'text-purple-700' : 'text-[#212121] group-hover:text-purple-700'}`}>{open === i ? '-' : '+'}</span>
          </div>
          {open === i && (
            <div className="pl-6 mt-2 text-[#555] text-base animate-fade-in">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#f9f6f1] flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#212121]">EPROD</span>
          <span className="bg-purple-700 text-purple-100 text-xs font-semibold px-2 py-1 rounded-full ml-2">-30% off with code SUMMER</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#features" className="text-[#212121] hover:text-purple-700 font-medium">Features</a>
          <a href="#pricing" className="text-[#212121] hover:text-purple-700 font-medium">Pricing</a>
          <a href="#faq" className="text-[#212121] hover:text-purple-700 font-medium">FAQ</a>
          <a href="/main-app" className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-800 transition font-semibold">Get Started</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 text-center mt-8">
        {/* Author */}
        <div className="flex flex-col items-center mb-4">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Author" className="w-12 h-12 rounded-full border-2 border-purple-400 mb-2" />
          <span className="text-sm text-[#212121]">By <span className="font-semibold text-purple-700">Your Name</span></span>
        </div>
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#212121] mb-4">
          Create stunning product images <span className="relative inline-block"><span className="bg-purple-700 absolute inset-x-0 bottom-0 h-3 -z-10 rounded-md"></span>in seconds</span>, not hours
        </h1>
        {/* Subheadline */}
        <p className="text-lg text-[#212121] max-w-2xl mx-auto mb-8">
          Everything you need to create beautiful, professional product images with AI—no design skills required. Start exploring EPROD's powerful features now.
        </p>
        {/* CTA Button */}
        <a href="/main-app">
          <button className="px-8 py-3 bg-purple-700 text-purple-100 font-bold rounded-xl shadow hover:bg-purple-800 transition mb-6">Get instant access</button>
        </a>
        {/* Social Proof Avatars */}
        <div className="flex items-center justify-center space-x-[-10px] mt-2">
          {[...Array(6)].map((_, i) => (
            <img key={i} src={`https://randomuser.me/api/portraits/men/${30+i}.jpg`} alt="User" className="w-8 h-8 rounded-full border-2 border-purple-900 shadow -ml-2" />
          ))}
          <span className="ml-3 text-purple-300 text-sm">+1000 creators joined</span>
        </div>
      </main>

      {/* Social Proof & Timeline Section */}
      <section className="w-full max-w-5xl mx-auto py-16 flex flex-col items-center px-4">
        {/* Avatars and Testimonial */}
        <div className="flex flex-col items-center mb-12 gap-4">
          <div className="flex items-center justify-center gap-[-10px]">
            {[...Array(6)].map((_, i) => (
              <img key={i} src={`https://randomuser.me/api/portraits/men/${40+i}.jpg`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow -ml-3" />
            ))}
          </div>
          <div className="text-lg text-[#212121] font-semibold mt-2">
            2,100 <span className="font-normal italic text-[#212121]">creators love EPROD</span>
          </div>
        </div>
        {/* Timeline as Cards */}
        <div className="w-full flex flex-wrap justify-center gap-6 mt-2">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 w-full sm:w-56 max-w-xs">
            <span className="text-5xl mb-3">🧠</span>
            <div className="font-bold text-[#212121] text-lg mb-1">Day 1</div>
            <div className="text-sm text-[#212121] text-center">Brainstorm your product idea</div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 w-full sm:w-56 max-w-xs">
            <span className="text-5xl mb-3">📸</span>
            <div className="font-bold text-[#212121] text-lg mb-1">Day 3</div>
            <div className="text-sm text-[#212121] text-center">Upload and generate images</div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 w-full sm:w-56 max-w-xs">
            <span className="text-5xl mb-3">🎨</span>
            <div className="font-bold text-[#212121] text-lg mb-1">Day 7</div>
            <div className="text-sm text-[#212121] text-center">Edit and refine with AI tools</div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 w-full sm:w-56 max-w-xs">
            <span className="text-5xl mb-3">🚀</span>
            <div className="font-bold text-[#212121] text-lg mb-1">Day 10</div>
            <div className="text-sm text-[#212121] text-center">Download and share your images</div>
          </div>
        </div>
      </section>

      {/* Pain Points vs Solution Section */}
      <section className="w-full bg-[#18191a] py-20 px-4 flex flex-col items-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white text-center mb-12">
          Stop <span className="italic text-[#e53935] font-bold">paying high amounts</span> for ads,<br />
          get <span className="italic text-[#e53935] font-bold">cheap & professional</span> product images instead
        </h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full justify-center">
          {/* Left Card: Pain Points */}
          <div className="flex-1 bg-[#201f1f] border border-[#e53935] rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-[#ff8a80]">Paying High Amounts for Ads</span>
              <span className="text-2xl bg-[#e53935] text-white rounded-full w-8 h-8 flex items-center justify-center">✖</span>
            </div>
            <ul className="text-[#ff8a80] text-base font-medium space-y-3 list-disc list-inside">
              <li>Expensive ad campaigns drain your budget</li>
              <li>Unpredictable results and low ROI</li>
              <li>Constant need to refresh creatives</li>
              <li>High competition drives up costs</li>
              <li>Time-consuming to manage and optimize</li>
            </ul>
          </div>
          {/* Right Card: Solution */}
          <div className="flex-1 bg-[#201f1f] border border-[#e53935] rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-[#ff8a80]">EPROD: Cheap & Professional Solution</span>
              <span className="text-2xl bg-[#43e97b] text-white rounded-full w-8 h-8 flex items-center justify-center">✔</span>
            </div>
            <ul className="text-[#fff] text-base font-medium space-y-3 list-disc list-inside">
              <li>Generate high-quality images for a fraction of the cost</li>
              <li>Instantly create new visuals for every campaign</li>
              <li>Stand out with unique, AI-powered designs</li>
              <li>Save time—no need for expensive photo shoots</li>
              <li>Professional results with zero design skills required</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Flywheel Section */}
      <section className="w-full bg-white py-20 px-4 flex flex-col items-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#212121] text-center mb-8">
          Start a product image <span className="relative inline-block"><span className="bg-[#b2e9d2] absolute inset-x-0 bottom-0 h-6 -z-10 rounded-md"></span>flywheel</span>
        </h2>
        <p className="text-lg text-[#212121] text-center max-w-2xl mb-10">
          Create, test, and improve your product images in days—not weeks. Instantly generate and iterate on visuals to boost your brand and sales, no design skills required.
        </p>
        <a href="/main-app">
          <button className="px-10 py-4 bg-purple-700 text-white font-bold rounded-full shadow hover:bg-purple-800 transition text-lg mb-4 border border-[#212121]">Get instant access</button>
        </a>
        <div className="flex items-center justify-center text-[#212121] text-sm mt-2">
          <span className="mr-2">✔</span> No design skills needed
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-white py-20 px-4 flex flex-col items-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#212121] text-center mb-12">
          Create stunning product images,<br /> boost your sales
        </h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full justify-center items-stretch">
          {/* Basic Plan */}
          <div className="flex-1 bg-white border border-[#212121] rounded-2xl shadow-lg p-8 flex flex-col justify-between min-w-[300px]">
            <div>
              <div className="text-xl font-bold text-[#212121] mb-2">EPROD Basic</div>
              <div className="text-[#212121] text-sm mb-6">Everything you need to create pro images fast</div>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl line-through text-gray-400 mr-2">$39</span>
                <span className="text-5xl font-extrabold text-[#212121]">$19</span>
                <span className="ml-1 text-base text-[#212121]">USD</span>
              </div>
              <ul className="text-[#212121] text-base space-y-3 mb-8">
                <li>✔ Unlimited image generations</li>
                <li>✔ Access to all basic templates</li>
                <li>✔ Fast generation (under 1 min)</li>
                <li>✔ Download in high quality</li>
                <li>✔ Email support</li>
              </ul>
            </div>
            <button className="w-full bg-purple-700 text-white font-bold py-3 rounded-full shadow hover:bg-purple-800 transition text-lg">Get EPROD Basic</button>
            <div className="text-center text-xs text-[#212121] mt-2">One-time payment, no subscription</div>
          </div>
          {/* Pro Bundle Plan */}
          <div className="flex-1 bg-[#18191a] border border-[#212121] rounded-2xl shadow-lg p-8 flex flex-col justify-between min-w-[300px] relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#212121] font-bold text-xs px-4 py-1 rounded-full shadow">BEST VALUE</div>
            <div>
              <div className="text-xl font-bold text-white mb-2">EPROD Pro Bundle</div>
              <div className="text-gray-200 text-sm mb-6">Unlock all features & exclusive bonuses</div>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl line-through text-gray-400 mr-2">$89</span>
                <span className="text-5xl font-extrabold text-white">$49</span>
                <span className="ml-1 text-base text-white">USD</span>
              </div>
              <ul className="text-white text-base space-y-3 mb-8">
                <li>✔ Everything in Basic</li>
                <li>✔ Advanced AI editing tools</li>
                <li>✔ Commercial use license</li>
                <li>✔ Priority support</li>
                <li>✔ Bonus: Social media image pack</li>
              </ul>
            </div>
            <button className="w-full bg-white text-purple-700 font-bold py-3 rounded-full shadow hover:bg-gray-100 transition text-lg border border-purple-700">Get Pro Bundle</button>
            <div className="text-center text-xs text-gray-200 mt-2">One-time payment, no subscription</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-white py-20 px-4 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212121] text-center mb-10">Frequently Asked Questions</h2>
        {/* Interactive FAQ */}
        <FAQSection />
      </section>

      {/* Policy & Copyright Section */}
      <section className="w-full bg-[#f8f7f7] border-t border-[#ececec] py-4 px-6 flex flex-col sm:flex-row items-center justify-between text-[#212121] text-sm mt-4">
        <div className="mb-2 sm:mb-0">© 2025 EprodAI, LLC. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </section>
    </div>
  );
}





