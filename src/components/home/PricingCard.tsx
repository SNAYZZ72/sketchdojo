import Link from "next/link"

interface PricingCardProps {
  plan: {
    title: string;
    price: string;
    period: string;
    description?: string;
    features: string[];
    buttonText: string;
    buttonLink?: string;
  };
  isPopular?: boolean;
}

export const PricingCard = ({ plan, isPopular = false }: PricingCardProps) => {
  return (
    <div 
      className={`relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/10 hover:transform hover:md:-translate-y-4 group ${
        isPopular ? 'border-2 border-sketchdojo-primary shadow-lg shadow-sketchdojo-primary/20 z-10 md:scale-105' : 'border border-white/10'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-sketchdojo-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="p-8 flex flex-col h-full">
        <div className="mb-6">
          <h4 className={`text-2xl font-semibold mb-3 ${isPopular ? 'text-sketchdojo-primary' : 'text-white'}`}>
            {plan.title}
          </h4>
          <p className="text-white/60 text-sm mb-6">{plan.description || "Perfect for getting started with manga creation"}</p>
          
          <div className="mb-6 flex items-end transition-all duration-300 group-hover:scale-105">
            <span className={`text-5xl font-bold ${isPopular ? 'text-sketchdojo-primary' : 'text-white'}`}>
              {plan.price}
            </span>
            <span className="text-white/60 ml-1 mb-1">{plan.period}</span>
          </div>
        </div>
        
        <ul className="space-y-4 mb-8 flex-grow">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-white/80 group-hover:text-white transition-colors duration-300">
              <svg className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${isPopular ? 'text-sketchdojo-primary' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link 
          href={plan.buttonLink || "#"}
          className={`w-full py-3 px-6 rounded-full font-medium text-center transition-all duration-500 transform hover:scale-105 ${
            isPopular 
              ? 'bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:shadow-lg hover:shadow-sketchdojo-primary/30' 
              : 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
          }`}
        >
          {plan.buttonText}
        </Link>
      </div>
    </div>
  )
}
