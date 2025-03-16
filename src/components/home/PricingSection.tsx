import { PricingCard } from "./PricingCard"

interface PricingSectionProps {
  pricingPlans: Array<{
    title: string;
    price: string;
    period: string;
    description?: string;
    features: string[];
    buttonText: string;
    buttonLink?: string;
  }>;
}

export const PricingSection = ({ pricingPlans }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-sketchdojo-bg-light to-sketchdojo-bg">
      <div className="max-w-6xl mx-auto">
        <span className="block text-center text-xs font-semibold tracking-widest text-sketchdojo-primary uppercase mb-3">Simple, transparent pricing</span>
        <h3 className="font-italianno text-6xl md:text-7xl text-white text-center mb-6">
          Pricing
        </h3>
        <h4 className="text-2xl md:text-3xl text-white text-center mb-6">
          Choose the plan that fits your needs
        </h4>
        <p className="text-white/80 text-lg text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          From hobbyist to professional, we have a plan for everyone. All plans come with a 14-day free trial. No credit card required.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={index} 
              plan={plan} 
              isPopular={index === 1} 
            />
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 text-center">
          <p className="text-white/60 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-sketchdojo-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>30-day money-back guarantee. No questions asked.</span>
          </p>
        </div>
      </div>
    </section>
  )
}