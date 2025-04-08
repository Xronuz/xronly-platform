"use client";

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { SignupDialog } from "@/components/auth/SignupDialog";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavLink {
  name: string;
  href: string;
  hasDropdown?: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links: NavLink[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Products",
      href: "#",
      hasDropdown: true,
    },
    {
      name: "Resources",
      href: "#",
      hasDropdown: true,
    },
    {
      name: "Pricing",
      href: "/pricing",
    },
    {
      name: "Blog",
      href: "/blog",
    },
  ];

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/75">
      <div className="container flex h-20 items-center px-4 sm:px-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Logo */}
        <div className="ml-4 flex h-20 items-center flex-shrink-0 md:ml-0">
          <Link href="/" className="flex items-center">
          <Image
              src="/logo.png"
              alt="Logo"
              width={300}
              height={60}
              className="max-w-[400px] max-h-[160px] w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:ml-8 md:flex md:flex-1 md:items-center md:justify-center md:space-x-8">
          {links.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                href={link.href}
                className={cn(
                  "nav-item inline-flex items-center space-x-1 text-sm font-medium",
                  pathname === link.href
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <span>{link.name}</span>
                {link.hasDropdown && (
                  <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-hover:rotate-180" />
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* Desktop authentication buttons */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Sign in
                  </Button>
                </DialogTrigger>
                <LoginDialog />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white font-medium text-black hover:bg-gray-100">
                    Sign up
                  </Button>
                </DialogTrigger>
                <SignupDialog />
              </Dialog>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 z-50 transform bg-black transition-all duration-300 ease-in-out md:hidden",
            isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          )}
        >
          <div className="fixed inset-x-0 top-20 z-50 origin-top transform p-2">
            <div className="divide-y divide-gray-800 rounded-lg bg-black shadow-lg ring-1 ring-white ring-opacity-5">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-3 py-2 text-base font-medium",
                      pathname === link.href
                        ? "text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <span>{link.name}</span>
                    {link.hasDropdown && (
                      <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>
                ))}
              </div>
              <div className="space-y-2 px-2 pb-3 pt-4">
                {user ? (
                  <>
                    <Link href="/dashboard" className="w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          Sign in
                        </Button>
                      </DialogTrigger>
                      <LoginDialog />
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start bg-white font-medium text-black hover:bg-gray-100">
                          Sign up
                        </Button>
                      </DialogTrigger>
                      <SignupDialog />
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
