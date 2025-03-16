import Image from "next/image"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-sketchdojo-bg overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sketchdojo-primary rounded-full filter blur-[80px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-sketchdojo-accent rounded-full filter blur-[100px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 py-12 max-w-4xl mx-auto">
        <h1 className="font-italianno text-7xl sm:text-8xl md:text-9xl text-white mb-6 sm:mb-8 tracking-wider">
          SketchDojo<span className="bg-clip-text text-transparent bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent">.Ai</span>
        </h1>

        <h3 className="text-2xl sm:text-3xl md:text-4xl text-white/90 font-medium mb-4 sm:mb-6 animate-fadeIn">
          Create your own <span className="bg-clip-text text-transparent bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent">Manga</span>
        </h3>

        <p className="text-base sm:text-lg md:text-xl text-white/80 mb-10 sm:mb-14 max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          Just let our AI tools guide you. Generate your characters, your world, and create the story of your dreams with our intuitive platform.
        </p>

        {/* CTA Buttons with improved animations */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <Link
            href="/studio/sign-up"
            className="relative overflow-hidden group font-medium text-lg sm:text-xl bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full
              transition-all duration-300 hover:shadow-lg hover:shadow-sketchdojo-primary/40 transform hover:-translate-y-1"
          >
            <span className="relative z-10">Get Started — It's Free</span>
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent blur-xl -z-10"></span>
          </Link>
          <button
            className="relative group font-medium text-lg sm:text-xl bg-transparent text-white border-2 border-white/30 px-8 sm:px-10 py-4 sm:py-5 rounded-full
              transition-all duration-300 hover:border-white hover:shadow-lg transform hover:-translate-y-1"
            aria-label="Watch demonstration video"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-sketchdojo-primary group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
              </svg>
              <span>Watch Demo</span>
            </span>
          </button>
        </div>
      </div>

      {/* Background Image with improved animation */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10 filter blur-[1px]">
        <div className="relative w-full max-w-4xl">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 animate-floating" style={{ animationDelay: "0s" }}>
            <Image
              src="/manga-panels.svg"
              alt="Manga Panel Background"
              width={600}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="absolute top-0 right-1/4 w-1/3 h-1/3 animate-floating-slow" style={{ animationDelay: "1.5s" }}>
            <Image
              src="/manga-panels.svg"
              alt="Manga Panel Background"
              width={400}
              height={300}
              className="w-full h-auto opacity-70"
            />
          </div>
          <div className="absolute bottom-1/4 left-1/3 w-1/4 h-1/4 animate-floating-fast" style={{ animationDelay: "2.8s" }}>
            <Image
              src="/manga-panels.svg"
              alt="Manga Panel Background"
              width={300}
              height={200}
              className="w-full h-auto opacity-50"
            />
          </div>
        </div>
      </div>
    </section>
  )
}