import { FeatureCard } from "./FeatureCard"

interface FeaturesProps {
  features: Array<{
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    width: number;
    height: number;
  }>;
}

export const FeaturesSection = ({ features }: FeaturesProps) => {
  return (
    <section id="features" className="py-32 px-6 bg-gradient-to-b from-sketchdojo-bg-light to-sketchdojo-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-semibold tracking-widest text-sketchdojo-primary uppercase mb-3">What we offer</span>
          <h3 className="font-italianno text-6xl md:text-7xl text-white mb-6">Features</h3>
          <h4 className="text-2xl md:text-3xl text-white mb-6">Build your Manga from scratch</h4>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Creating Manga has never been more accessible. With SketchDojo.ai, simply describe your 
            vision and watch as AI brings it to life with unprecedented accuracy.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}