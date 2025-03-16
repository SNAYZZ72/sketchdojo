import Image from "next/image"

interface CommunityCardProps {
  item: {
    title: string;
    author: string;
    image: string;
  };
}

export const CommunityCard = ({ item }: CommunityCardProps) => {
  return (
    <div className="community-card bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-sketchdojo-primary/30 hover:transform hover:scale-105 group">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-start p-4">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">View Project</span>
        </div>
        <Image
          src={item.image}
          alt={`${item.title} by ${item.author}`}
          width={300}
          height={200}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h5 className="text-gray-800 font-medium text-lg transition-colors duration-300 group-hover:text-sketchdojo-primary">{item.title}</h5>
        <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-sketchdojo-primary/80 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
          {item.author}
        </p>
      </div>
    </div>
  )
}