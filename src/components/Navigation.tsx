import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pill, Home, FileText, Eye } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border shadow-sm print:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Pill className="h-8 w-8 text-[hsl(var(--pha-indigo))]" />
            <h1 className="text-xl font-bold pha-text">The Plant 2 Alert</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              asChild
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
            >
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Welcome
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive("/scenario") ? "default" : "ghost"}
              size="sm"
            >
              <Link to="/scenario" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Scenario
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive("/instructor") ? "default" : "ghost"}
              size="sm"
            >
              <Link to="/instructor" className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Instructor View
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
