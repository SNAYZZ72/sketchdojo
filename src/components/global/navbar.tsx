import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/global/mode-toggle";
import { UserButton } from "@/components/global/user-button";
import { 
  LayoutGrid, 
  Book, 
  PanelLeftOpen, 
  Wrench,
  Paintbrush,
  FileText,
  LayoutDashboard
} from "lucide-react";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/studio",
    icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
  },
  {
    title: "Projects",
    href: "/studio/projects",
    icon: <Book className="h-5 w-5 mr-2" />,
  },
  {
    title: "Tools",
    href: "/studio/tools",
    icon: <Wrench className="h-5 w-5 mr-2" />,
  },
  {
    title: "Gallery",
    href: "/studio/gallery",
    icon: <Paintbrush className="h-5 w-5 mr-2" />,
  },
  {
    title: "Templates",
    href: "/studio/templates",
    icon: <LayoutGrid className="h-5 w-5 mr-2" />,
  },
  {
    title: "Docs",
    href: "/docs",
    icon: <FileText className="h-5 w-5 mr-2" />,
  },
];

interface NavbarProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

export function Navbar({ showMobileMenu, setShowMobileMenu }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background h-16 flex items-center">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4 px-0 text-base hover:bg-transparent hover:text-primary focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <PanelLeftOpen className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">
              SketchDojo
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex md:ml-6">
            {mainNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
} 