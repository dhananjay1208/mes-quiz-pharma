import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pha-gradient flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Button 
          onClick={() => navigate("/")}
          size="lg"
          variant="secondary"
        >
          <Home className="mr-2 h-5 w-5" />
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
