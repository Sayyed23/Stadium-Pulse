"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("admin");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, passcode }),
      });

      if (res.ok) {
        if (role === "admin") router.push("/ops/dashboard");
        else if (role === "operator") router.push("/ops");
        else router.push("/ops/volunteer");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Staff Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md p-2 bg-transparent"
              placeholder="e.g. Control Room Admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md p-2 bg-transparent"
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Passcode</label>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md p-2 bg-transparent"
              placeholder="Enter ops passcode"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
