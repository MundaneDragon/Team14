"use client"
import SignCard from "../components/signCard"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { Input } from "../components/input";
import { signIn } from "@/lib/auth";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { register, handleSubmit, formState: { errors }} = useForm({
        mode: "onSubmit",
        defaultValues: {
        email: "",
        password: ""
        }
    });

    const onSubmit = async ({ email, password }) => {
        try {
            setLoading(true);
            setError("");
            await signIn({ email, password });
            router.push("/");
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full h-dvh justify-center items-center">
                <SignCard>
                    <img src="/googleiconrm.png" className="w-32 h-32"/>
                    <h1 className="text-4xl font-semibold text-nowrap my-16">
                        Welcome back
                    </h1>

                    <div className="flex flex-col w-full gap-4 mb-16">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <Input
                            {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            }
                            })}
                            type="email" 
                            id="email" 
                            className={`bg-[#282828] p-4 w-full rounded-3xl ${errors.email && "border-[#FF7F7F]"}`}
                            placeholder="Enter your email address"
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-[#FF7F7F] text-[0.8rem]">{errors.email.message}</p>
                        )}
                        <Input 
                            {...register("password", {
                                required: "Password is required"
                            })}
                            type="password" 
                            id="password"
                            className={`bg-[#282828] p-4 w-full rounded-3xl ${errors.password && "border-[#FF7F7F]"}`}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                        {errors.password && (
                            <p className="text-[#FF7F7F] text-[0.8rem]">{errors.password.message}</p>
                        )}
                        <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white text-right">
                            Forgot password?
                        </Link>
                        <button 
                            className="w-full p-4 rounded-full cursor-pointer bg-[#A3CBFF] hover:bg-[#A3CBFF]/80 text-black disabled:opacity-50 disabled:cursor-not-allowed" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                    <p className="text-nowrap text-gray-400">
                        Don't have an account? <Link className="underline text-white" href="/register">
                            Create one here.
                        </Link>
                    </p>
                    <p className="text-nowrap text-gray-400 mt-4">
                        View as guest instead? <Link className="underline text-white" href="/">
                                Click Here.
                            </Link>
                    </p>
                </SignCard>
            </div>
        </form>
    )
}


