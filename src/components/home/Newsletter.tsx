export const Newsletter = () => {
    return (
      <section className="py-16 px-6 bg-gradient-radial from-sketchdojo-primary/20 to-transparent">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl text-white font-semibold mb-4">
              Stay up to date with <span className="bg-clip-text text-transparent bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent">SketchDojo.AI</span>
            </h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter for tips, tutorials, and early access to new features.
            </p>
          </div>
          
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sketchdojo-primary focus:border-transparent transition-all duration-300"
              required
            />
            <button 
              type="submit"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-sketchdojo-primary/30 transform hover:-translate-y-1"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-white/60 text-sm text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    )
  }