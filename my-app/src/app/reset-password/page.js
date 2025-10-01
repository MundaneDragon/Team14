"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import SignCard from "../components/signCard";
import { Input } from "../components/input";
import { updatePassword } from "@/lib/auth";

export default function ResetPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        mode: "onSubmit",
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    const password = watch("password");

    const onSubmit = async ({ password }) => {
        try {
            setLoading(true);
            setError("");
            await updatePassword(password);
            alert("Password updated successfully!");
            router.push("/login");
        } catch (err) {
            setError(err.message || "Failed to update password. Please try again.");
            console.error("Password update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full h-dvh justify-center items-center">
                <SignCard>
                    <img src="/googleiconrm.png" className="w-32 h-32"/>
                    <h1 className="text-4xl font-semibold text-nowrap my-8">
                        Set New Password
                    </h1>
                    <p className="text-gray-400 mb-8 text-center">
                        Enter your new password below.
                    </p>

                    <div className="flex flex-col w-full gap-4 mb-16">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <Input
                            {...register("password", {
                                required: "Password is required",
                            })}
                            type="password" 
                            id="password" 
                            className={`bg-[#282828] p-4 w-full rounded-3xl ${errors.password && "border-[#FF7F7F]"}`}
                            placeholder="Enter new password"
                            disabled={loading}
                        />
                        {errors.password && (
                            <p className="text-[#FF7F7F] text-[0.8rem]">{errors.password.message}</p>
                        )}
                        <Input
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                            type="password" 
                            id="confirmPassword" 
                            className={`bg-[#282828] p-4 w-full rounded-3xl ${errors.confirmPassword && "border-[#FF7F7F]"}`}
                            placeholder="Confirm new password"
                            disabled={loading}
                        />
                        {errors.confirmPassword && (
                            <p className="text-[#FF7F7F] text-[0.8rem]">{errors.confirmPassword.message}</p>
                        )}
                        <button 
                            className="w-full p-4 rounded-full cursor-pointer bg-[#A3CBFF] hover:bg-[#A3CBFF]/80 text-black disabled:opacity-50 disabled:cursor-not-allowed" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </SignCard>
            </div>
        </form>
    );
}
