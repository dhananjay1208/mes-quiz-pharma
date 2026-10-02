import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Lock, Eye } from "lucide-react";

interface InstructorLoginProps {
  onLogin: () => void;
}

const InstructorLogin = ({ onLogin }: InstructorLoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const form = useForm({
    defaultValues: {
      password: ""
    }
  });

  const handleSubmit = (data: { password: string }) => {
    // Simple password check (family instructor code)
    if (data.password === "1208") {
      setError("");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-[hsl(var(--pha-indigo))]" />
          </div>
          <CardTitle className="text-2xl pha-text">Instructor Access</CardTitle>
          <CardDescription>
            Enter the instructor password to view team submissions and model answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter instructor password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full pha-gradient hover:opacity-90">
                Access Dashboard
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorLogin;
