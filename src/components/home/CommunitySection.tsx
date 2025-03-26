import Link from "next/link"
import { InfiniteScroll } from "./InfiniteScroll"

interface CommunitySectionProps {
  communityGallery: Array<{
    title: string;
    author: string;
    image: string;
  }>;
}

export const CommunitySection = ({ communityGallery }: CommunitySectionProps) => {
  return (
    <section id="community" className="py-12 md:py-24 px-4 md:px-6 bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light">
      <div className="max-w-6xl mx-auto">
        <span className="block text-center text-xs font-semibold tracking-widest text-sketchdojo-primary uppercase mb-2 md:mb-3">Join thousands of creators</span>
        <h3 className="font-italianno text-5xl md:text-7xl text-white text-center mb-4 md:mb-6">
          Community
        </h3>
        <h4 className="text-xl md:text-3xl text-white text-center mb-4 md:mb-6">
          Join our growing community of manga creators
        </h4>
        <p className="text-white/80 text-base md:text-lg text-center max-w-2xl mx-auto mb-8 md:mb-16 leading-relaxed">
          Connect with fellow creators, share your work, and get inspired by others. Our community is growing every day with creators just like you.
        </p>

        {/* Scrolling Galleries */}
        <div className="space-y-4 md:space-y-6 overflow-hidden">
          <InfiniteScroll items={communityGallery} direction="left" />
          <InfiniteScroll items={communityGallery} direction="right" />
        </div>

        {/* Community CTA */}
        <div className="mt-10 md:mt-16 text-center">
          <Link 
            href="/community" 
            className="inline-flex items-center gap-2 text-white border-b-2 border-sketchdojo-primary pb-1 transition-all duration-300 hover:text-sketchdojo-primary text-base md:text-lg"
          >
            <span>Explore Community</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}