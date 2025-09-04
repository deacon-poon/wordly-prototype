"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Building2,
  Globe,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    name: string;
    type: "organization" | "workspace";
    domain?: string;
  }> | null>(null);

  const handleSignInWithWordly = () => {
    setIsLoading(true);
    // Redirect to Keycloak SSO
    window.location.href = "/auth/keycloak"; // Replace with actual Keycloak endpoint
  };

  const handleSearchSSO = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    // Simulate SSO search
    setTimeout(() => {
      // Mock search results - replace with actual API call
      const mockResults = [
        {
          name: "Acme Corporation",
          type: "organization" as const,
          domain: "acme.com",
        },
        { name: "Global Tech Solutions", type: "workspace" as const },
      ];
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-teal-25 via-white to-accent-light-blue-25 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--primary-teal-200))_1px,_transparent_0)] bg-[size:24px_24px] opacity-20"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative z-10">
        {/* Subtle background gradient */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary-teal-100 via-primary-teal-50 to-transparent opacity-40 blur-3xl -mt-20"></div>

        <div className="p-8 relative z-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6">
              <Image
                src="/logo/wordly-logo-primary-with-radius-border.png"
                alt="Wordly Logo"
                width={96}
                height={96}
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-center text-gray-500 mt-2">
                Sign in with Wordly to access real-time interpretation
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Primary SSO Button */}
            <Button
              onClick={handleSignInWithWordly}
              disabled={isLoading}
              className="w-full h-12"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  SIGN IN WITH WORDLY
                </div>
              )}
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-400">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* SSO Search Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email or Organization Name
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email or organization name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSSO()}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-12 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-teal-500/50 focus:border-primary-teal-500"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleSearchSSO}
                disabled={!email.trim() || isLoading}
                variant="outline"
                className="w-full h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary-teal-600 rounded-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-primary-teal-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Search for SSO
                  </>
                )}
              </Button>

              {/* Search Results */}
              {searchResults && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm text-gray-700 font-medium">
                    Found organizations:
                  </p>
                  {searchResults.map((result, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto p-4 justify-start text-left hover:bg-primary-teal-50 hover:border-primary-teal-200 rounded-lg"
                      onClick={() => {
                        // Handle SSO organization selection
                        window.location.href = `/auth/sso/${
                          result.domain || result.name
                        }`;
                      }}
                    >
                      <div className="flex items-center w-full">
                        {result.type === "organization" ? (
                          <Building2 className="w-5 h-5 text-primary-teal-600 mr-3" />
                        ) : (
                          <Globe className="w-5 h-5 text-accent-green-600 mr-3" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {result.name}
                          </div>
                          {result.domain && (
                            <div className="text-sm text-gray-500">
                              {result.domain}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6">
            <p className="text-sm text-center text-gray-500 w-full">
              Need help?{" "}
              <Link
                href="/support"
                className="text-primary-teal-600 hover:underline font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
