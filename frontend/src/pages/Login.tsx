import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router";
import useLogin from "@/hooks/auth/useLogin";
import axios from "axios";

function Login() {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    password?: string[];
    email?: string[];
  }>({});

  const [authError, setAuthError] = useState("");

  const loginMutation = useLogin();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationErrors({});
    setAuthError("");

    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: () => navigate("/home"),

        onError: (error) => {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              setAuthError("Invalid email or password");
              return;
            }

            setValidationErrors(error.response?.data.errors ?? {});
          } else {
            setAuthError(error.message);
          }
        },
      },
    );
  };
  return (
    <div className="min-h-screen w-full flex flex-row justify-center items-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Today you are a <span className="font-logo font-bold">Quittr</span>.
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="login-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />

                {validationErrors.email?.map((error) => (
                  <p key={error} className="text-destructive">
                    {error}
                  </p>
                ))}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            {validationErrors.password?.map((error) => (
              <p key={error} className="text-destructive">
                {error}
              </p>
            ))}
          </form>
          {authError && <p className="text-sm text-destructive">{authError}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" type="submit" form="login-form">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
