import Image from "next/image"

interface FeatureProps {
  feature: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    width: number;
    height: number;
  };
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureProps) => {
  return (
    <div
      className={`feature-card bg-white/5 backdrop-blur-sm rounded-3xl p-8 flex flex-col ${
        index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-8 transition-all duration-500 hover:bg-white/10 hover:shadow-xl hover:shadow-sketchdojo-primary/20 group`}
    >
      <div className="md:w-1/2 space-y-5 transition-all duration-300">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-sketchdojo-primary/20 to-sketchdojo-accent/20 mb-4 group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent">
            {index + 1}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl text-white font-semibold transition-colors duration-300 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-sketchdojo-primary group-hover:to-sketchdojo-accent">
          {feature.title}
        </h3>
        <p className="text-white/80 text-lg leading-relaxed transition-colors duration-300 group-hover:text-white/95">
          {feature.description}
        </p>
      </div>
      <div className="md:w-1/2 transition-all duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-2xl group-hover:shadow-sketchdojo-primary/30 transition-all duration-500 group-hover:transform group-hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            width={feature.width}
            height={feature.height}
            className="w-full h-auto transition-all duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  )
}