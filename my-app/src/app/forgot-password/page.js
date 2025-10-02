"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from "next/link";
import SignCard from "../components/signCard";
import { Input } from "../components/input";
import { resetPassword } from "@/lib/auth";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onSubmit",
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async ({ email }) => {
        try {
            setLoading(true);
            setError("");
            setSuccess(false);
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Failed to send reset email. Please try again.");
            console.error("Password reset error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full h-dvh justify-center items-center">
                <SignCard>
                    <img src="/logo.png" />
                    <h1 className="text-4xl font-semibold text-nowrap my-8">
                        Reset Password
                    </h1>
                    <p className="text-gray-400 mb-8 text-center">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div className="flex flex-col w-full gap-4 mb-16">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg text-sm">
                                Password reset email sent! Please check your inbox.
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
                        <button 
                            className="w-full p-4 rounded-full cursor-pointer bg-[#A3CBFF] hover:bg-[#A3CBFF]/80 text-black disabled:opacity-50 disabled:cursor-not-allowed" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </div>
                    <p className="text-nowrap text-gray-400">
                        Remember your password? <Link className="underline text-white" href="/login">
                            Sign in here.
                        </Link>
                    </p>
                </SignCard>
            </div>
        </form>
    );
}
