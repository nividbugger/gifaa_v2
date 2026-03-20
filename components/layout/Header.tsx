"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, Gift, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-gold/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Gifaa" className="h-11 w-auto group-hover:scale-105 transition-transform duration-300" src="/gifaa-logo.png" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#occasions" className="text-charcoal-light hover:text-royal transition-colors duration-200 text-sm font-medium">
            Occasions
          </a>
          <a href="/#how-it-works" className="text-charcoal-light hover:text-royal transition-colors duration-200 text-sm font-medium">
            How It Works
          </a>
          <a href="/#faqs" className="text-charcoal-light hover:text-royal transition-colors duration-200 text-sm font-medium">
            FAQs
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-charcoal/10 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-gold/20">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
                    <AvatarFallback className="bg-royal text-gold font-medium">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-charcoal">{profile?.display_name || "User"}</p>
                  <p className="text-xs text-charcoal-light truncate">{user.email}</p>
                  {profile?.phone_number && (
                    <p className="text-xs text-charcoal-light flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {profile.phone_number}
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Gift className="w-4 h-4" />
                    My Registries
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-charcoal hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="royal" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory border-t border-gold/10 px-6 py-4 space-y-4">
          <a href="/#occasions" className="block text-charcoal-light hover:text-royal transition-colors duration-200 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
            Occasions
          </a>
          <a href="/#how-it-works" className="block text-charcoal-light hover:text-royal transition-colors duration-200 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </a>
          <a href="/#faqs" className="block text-charcoal-light hover:text-royal transition-colors duration-200 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
            FAQs
          </a>
          {!user && (
            <div className="pt-4 border-t border-gold/10">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full mb-2">Sign In</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="royal" size="sm" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
