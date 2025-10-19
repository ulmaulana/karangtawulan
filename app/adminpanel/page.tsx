"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Login gagal. Periksa email dan password Anda.");
      } else {
        // Redirect to dashboard or specified redirect URL
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sea-foam/20 via-white to-sea-ocean/10 p-4">
      <Card className="w-full max-w-md p-8 bg-white border-0 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sea-ocean to-sea-teal flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-sea-ocean tracking-tight mb-2">Admin Login</h1>
          <p className="text-gray-600">Pantai Karangtawulan</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="pl-10 h-12 rounded-xl border-gray-300 focus:border-sea-ocean focus:ring-sea-ocean"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium mb-2 block">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-10 h-12 rounded-xl border-gray-300 focus:border-sea-ocean focus:ring-sea-ocean"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Memproses...
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Lupa password?{" "}
            <a href="#" className="text-sea-ocean hover:text-sea-teal font-medium">
              Reset password
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
