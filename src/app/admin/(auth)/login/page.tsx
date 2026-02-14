"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-white/10 bg-[#1a1a2e] p-8 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-white font-mono">Admin Access</h1>
                    <p className="mt-2 text-sm text-muted-foreground font-mono">Enter your credentials to continue</p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs uppercase tracking-wider text-muted-foreground font-mono mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono sm:text-sm"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs uppercase tracking-wider text-muted-foreground font-mono mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="rounded-md bg-red-900/20 p-3 text-center text-sm text-red-500 font-mono border border-red-900/50">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center rounded-md bg-primary py-3 px-4 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-mono transition-colors"
                    >
                        {isPending ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
