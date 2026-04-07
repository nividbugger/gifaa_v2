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
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Gifaa" className="h-11 w-auto group-hover:scale-105 transition-transform duration-300" src="/gifaa-logo.png" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 font-serif tracking-tight">
            <a href="/#occasions" className="text-on-surface hover:text-[#79590f] transition-colors duration-300 text-sm">
              Occasions
            </a>
            <a href="/#how-it-works" className="text-on-surface hover:text-[#79590f] transition-colors duration-300 text-sm">
              How It Works
            </a>
            <a href="/search" className="text-on-surface hover:text-[#79590f] transition-colors duration-300 text-sm">
              Find a Registry
            </a>
            <a href="/#faqs" className="text-on-surface hover:text-[#79590f] transition-colors duration-300 text-sm">
              FAQs
            </a>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Desktop search */}
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full gap-2">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>search</span>
            <input
              className="bg-transparent border-none focus:outline-none text-sm w-40 font-sans text-on-surface placeholder:text-on-surface-variant"
              placeholder="Find a registry"
              type="text"
              onKeyDown={(e) => { if (e.key === "Enter") router.push(`/search?q=${(e.target as HTMLInputElement).value}`); }}
            />
          </div>

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-outline-variant">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
                    <AvatarFallback className="bg-[#093a6f] text-white font-medium text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{profile?.display_name || "User"}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                  {profile?.phone_number && (
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
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
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-on-surface hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
          )}

          <Link href={user ? "/dashboard" : "/signup"}>
            <Button
              size="sm"
              className="bg-[#093a6f] text-white hover:bg-[#0d4a8a] px-5 py-2 rounded-md font-medium text-sm tracking-wide shadow-lg transition-all hidden sm:inline-flex"
            >
              Create Registry
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant/20 px-6 py-4 space-y-4">
          <a href="/#occasions" className="block text-on-surface-variant hover:text-[#79590f] transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
            Occasions
          </a>
          <a href="/#how-it-works" className="block text-on-surface-variant hover:text-[#79590f] transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </a>
          <a href="/search" className="block text-on-surface-variant hover:text-[#79590f] transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
            Find a Registry
          </a>
          <a href="/#faqs" className="block text-on-surface-variant hover:text-[#79590f] transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
            FAQs
          </a>
          {!user && (
            <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full bg-[#093a6f] text-white hover:bg-[#0d4a8a]">Create Registry</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
