"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Chrome } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithGoogle, handleAuthStateChange } from "@/lib/auth";

interface LoginDialogProps {
  onClose?: () => void;
}

export function LoginDialog({ onClose }: LoginDialogProps) {
  const id = "login";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthStateChange(userCredential.user);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      await handleAuthStateChange(user);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md bg-black border border-gray-800">
      <div className="flex flex-col items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800"
          aria-hidden="true"
        >
          <Chrome className="h-6 w-6 text-white" />
        </div>
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-white">
            Welcome back
          </DialogTitle>
          <DialogDescription className="text-base text-gray-400">
            Enter your credentials to login to your account
          </DialogDescription>
        </DialogHeader>
      </div>

      <form onSubmit={handleLogin} className="mt-4 space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor={`${id}-email`} className="text-gray-400">Email</Label>
            <Input 
              id={`${id}-email`} 
              placeholder="hi@yourcompany.com" 
              type="email" 
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <Label htmlFor={`${id}-password`} className="text-gray-400">Password</Label>
            <Input
              id={`${id}-password`}
              placeholder="Enter your password"
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id={`${id}-remember`} disabled={isLoading} />
            <Label 
              htmlFor={`${id}-remember`} 
              className="text-sm text-gray-400"
            >
              Remember me
            </Label>
          </div>
          <Button variant="link" className="px-0 font-normal text-gray-400 hover:text-white">
            Forgot password?
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-gray-100 font-medium" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="relative my-4 flex items-center">
        <div className="flex-1 border-t border-gray-800" />
        <div className="mx-4">
          <span className="text-sm text-gray-500">
            Or continue with
          </span>
        </div>
        <div className="flex-1 border-t border-gray-800" />
      </div>

      <Button 
        variant="outline" 
        className="w-full border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white" 
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Google
      </Button>
    </DialogContent>
  );
}
