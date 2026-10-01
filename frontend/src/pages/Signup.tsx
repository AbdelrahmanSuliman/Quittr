import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";

import useSignup from "@/hooks/auth/useSignup";
import axios from "axios";

function Signup() {
  const signupMutation = useSignup();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    username?: string[];
    password?: string[];
    email?: string[];
  }>({});

  let navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    signupMutation.mutate(
      { email, username, password },
      {
        onSuccess: () => {
          navigate("/home");
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            setValidationErrors(error.response?.data.errors);
          }
        },
      },
    );
  };
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-background gap-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Ready to become a{" "}
            <span className="font-logo font-bold">Quittr</span>?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="signup-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="JohnDoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {validationErrors.username?.map((error) => (
                  <p key={error} className="text-destructive">
                    {error}
                  </p>
                ))}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    onClick={() => navigate("/login")}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Already have an account?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {validationErrors.password?.map((error) => (
                  <p key={error} className="text-destructive">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form="signup-form">
            Signup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
