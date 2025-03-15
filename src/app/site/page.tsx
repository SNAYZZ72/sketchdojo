"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/navigation/site/header"
import { Footer } from '@/components/navigation/site/footer'
import { features, communityGallery, pricingPlans } from "@/components/constants/navigation"

export default function Home() {

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#0F1729] overflow-hidden">
        {/* Main Content */}
        <div className="relative z-10 text-center px-4 sm:px-8">
          <h1 className="font-italianno text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white mb-4 sm:mb-6">
            SketchDojo.Ai
          </h1>

          <h3 className="title text-xl sm:text-2xl md:text-3xl text-white/90 mb-2 sm:mb-4">
            Create your own Manga
          </h3>

          <p className="body-text text-sm sm:text-base md:text-lg text-white/80 mb-8 sm:mb-12 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
            Just let our AI tools guide you. Generate your characters, your world, and create the story of your dreams.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link
              href="/studio/sign-up"
              className="font-italianno text-xl sm:text-2xl md:text-3xl bg-white text-[#0F1729] px-6 sm:px-8 py-3 sm:py-4 rounded-full
                transform transition-all hover:scale-105 hover:bg-[#C23FDC] hover:text-white hover:shadow-lg hover:shadow-[#C23FDC]/30"
            >
              Get Started
            </Link>
            <button
              className="font-italianno text-xl sm:text-2xl md:text-3xl bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full
                transform transition-all hover:scale-105 hover:bg-[#C23FDC] hover:shadow-lg hover:shadow-[#C23FDC]/30"
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg opacity-20 floating-image animate-floating">
            <Image
              src="/manga-panels.svg"
              alt="Manga Panels"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen py-32 px-4 bg-[#0F1729]">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h3 className="font-italianno text-6xl text-white mb-4">Features</h3>
            <h4 className="subtitle text-white mb-6">Build your Manga from scratch</h4>
            <p className="body-text text-white/80 max-w-2xl mx-auto">
              Creating Manga has never been more accessible. With SketchDojo.ai, simply describe your 
              vision and watch as AI brings it to life.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card bg-white/5 rounded-3xl p-8 flex flex-col ${
                  index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-8 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-[#C23FDC]/20 hover:transform hover:scale-[1.02] group`}
              >
                <div className="md:w-1/2 space-y-4 transition-all duration-300">
                  <h3 className="text-2xl text-white font-semibold transition-colors duration-300 group-hover:text-[#C23FDC]">{feature.title}</h3>
                  <p className="text-white/80 transition-colors duration-300 group-hover:text-white/90">{feature.description}</p>
                </div>
                <div className="md:w-1/2 transition-all duration-300 group-hover:scale-[1.03]">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={feature.width}
                    height={feature.height}
                    className="rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#C23FDC]/10"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4 bg-[#0F1729]">
        <h3 className="font-italianno text-6xl text-white text-center mb-16">
          Community
        </h3>
        <h4 className="subtitle text-white text-center mb-8">
          Join our growing community of manga creators
        </h4>
        <p className="body-text text-white/80 text-center max-w-2xl mx-auto mb-12">
          Connect with fellow creators, share your work, and get inspired by others.
        </p>

        {/* Scrolling Gallery - Left to Right */}
        <div className="overflow-hidden relative mb-8">
          <div className="flex animate-scroll whitespace-nowrap">
            {/* First set of images */}
            {communityGallery.map((item, index) => (
              <div key={`first-${index}`} className="min-w-[250px] p-4 inline-block">
                <div className="community-card bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:border-2 hover:border-[#C23FDC] hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#C23FDC]/20 group">
                  <Image
                    src={item.image}
                    alt={`${item.title} by ${item.author}`}
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h5 className="text-gray-800 font-medium mt-3 text-lg transition-colors duration-300 group-hover:text-[#C23FDC]">{item.title}</h5>
                  <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-[#C23FDC]/80">by {item.author}</p>
                </div>
              </div>
            ))}
            {/* Duplicate sets for seamless looping */}
            {communityGallery.map((item, index) => (
              <div key={`second-${index}`} className="min-w-[250px] p-4 inline-block">
                <div className="community-card bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:border-2 hover:border-[#C23FDC] hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#C23FDC]/20 group">
                  <Image
                    src={item.image}
                    alt={`${item.title} by ${item.author}`}
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h5 className="text-gray-800 font-medium mt-3 text-lg transition-colors duration-300 group-hover:text-[#C23FDC]">{item.title}</h5>
                  <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-[#C23FDC]/80">by {item.author}</p>
                </div>
              </div>
            ))}
            {/* Third set for extra coverage */}
            {communityGallery.map((item, index) => (
              <div key={`third-set-${index}`} className="min-w-[250px] p-4 inline-block">
                <div className="community-card bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:border-2 hover:border-[#C23FDC] hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#C23FDC]/20 group">
                  <Image
                    src={item.image}
                    alt={`${item.title} by ${item.author}`}
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h5 className="text-gray-800 font-medium mt-3 text-lg transition-colors duration-300 group-hover:text-[#C23FDC]">{item.title}</h5>
                  <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-[#C23FDC]/80">by {item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Scrolling Gallery - Right to Left */}
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll-reverse whitespace-nowrap">
            {/* First set of images */}
            {communityGallery.map((item, index) => (
              <div key={`third-${index}`} className="min-w-[250px] p-4 inline-block">
                <div className="community-card bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:border-2 hover:border-[#C23FDC] hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#C23FDC]/20 group">
                  <Image
                    src={item.image}
                    alt={`${item.title} by ${item.author}`}
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h5 className="text-gray-800 font-medium mt-3 text-lg transition-colors duration-300 group-hover:text-[#C23FDC]">{item.title}</h5>
                  <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-[#C23FDC]/80">by {item.author}</p>
                </div>
              </div>
            ))}
            {/* Duplicate sets for seamless looping */}
            {communityGallery.map((item, index) => (
              <div key={`fourth-${index}`} className="min-w-[250px] p-4 inline-block">
                <div className="community-card bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:border-2 hover:border-[#C23FDC] hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#C23FDC]/20 group">
                  <Image
                    src={item.image}
                    alt={`${item.title} by ${item.author}`}
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h5 className="text-gray-800 font-medium mt-3 text-lg transition-colors duration-300 group-hover:text-[#C23FDC]">{item.title}</h5>
                  <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-[#C23FDC]/80">by {item.author}</p>
                </div>
              </div>
            ))}
            {/* Third set for extra coverage */}
            {communityGallery.map((item, index) => (
              <div key={`fourth-set-${index}`} className="min-w-[250px] p-4 inline-block">
                <div className="community-card bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:border-2 hover:border-[#C23FDC] hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#C23FDC]/20 group">
                  <Image
                    src={item.image}
                    alt={`${item.title} by ${item.author}`}
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h5 className="text-gray-800 font-medium mt-3 text-lg transition-colors duration-300 group-hover:text-[#C23FDC]">{item.title}</h5>
                  <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-[#C23FDC]/80">by {item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-[#0F1729]">
        <h3 className="font-italianno text-6xl text-white text-center mb-16">
          Pricing
        </h3>
        <h4 className="subtitle text-white text-center mb-8">
          Choose the plan that fits your needs
        </h4>
        <p className="body-text text-white/80 text-center max-w-2xl mx-auto mb-12">
          From hobbyist to professional, we have a plan for everyone.
        </p>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-2 hover:border-[#C23FDC] hover:transform hover:md:-translate-y-4 hover:scale-105 group`}
            >
              <div className="p-8 flex flex-col items-center">
                <h4 className={`text-2xl font-semibold mb-4 transition-colors duration-300 text-gray-800 group-hover:text-[#C23FDC]`}>{plan.title}</h4>
                <p className="mb-6 flex items-end transition-all duration-300 group-hover:scale-110">
                  <span className="text-5xl font-bold text-gray-800 group-hover:text-[#C23FDC]">{plan.price}</span>
                  <span className="text-gray-500 ml-1 group-hover:text-[#C23FDC]/80">{plan.period}</span>
                </p>
                <ul className="space-y-4 mb-8 w-full">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center transition-transform duration-300 hover:translate-x-1">
                      <svg className={`w-5 h-5 mr-2 transition-all duration-300 ${index === 1 ? 'text-green-500 group-hover:text-[#C23FDC]' : 'text-green-500 group-hover:text-[#C23FDC]'} group-hover:scale-125`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${index === 1 
                    ? 'bg-black text-white hover:bg-[#C23FDC] group-hover:bg-[#C23FDC] hover:shadow-lg hover:shadow-[#C23FDC]/30' 
                    : 'bg-black text-white hover:bg-gray-800 group-hover:bg-[#C23FDC]'}`}
                >
                  <a href={plan.buttonLink}>{plan.buttonText}</a>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  )
}
