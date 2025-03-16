import { CommunityCard } from "./CommunityCard"

interface InfiniteScrollProps {
  items: Array<{
    title: string;
    author: string;
    image: string;
  }>;
  direction?: "left" | "right";
}

export const InfiniteScroll = ({ items, direction = "left" }: InfiniteScrollProps) => {
  return (
    <div className="overflow-hidden relative py-4">
      <div className={`flex ${direction === "left" ? "animate-scroll" : "animate-scroll-reverse"} whitespace-nowrap`}>
        {/* Triple the items for continuous scrolling */}
        {[...items, ...items, ...items].map((item, index) => (
          <div key={`scroll-${direction}-${index}`} className="min-w-[250px] p-4 inline-block">
            <CommunityCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}