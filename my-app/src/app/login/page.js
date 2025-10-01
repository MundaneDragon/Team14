"use client"
import SignCard from "../components/signCard"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { Input } from "../components/input";

export default function Login() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }} = useForm({
        mode: "onSubmit",
        defaultValues: {
        email: "",
        password: ""
        }
    });

    const onSubmit = async ({ email, password }) => {
        try {
            // await signIn({ email, password });
            router.push("/");
        } catch (err) {
            alert(`Signin failed: ${err.message}`);
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
                        />
                        {errors.password && (
                            <p className="text-[#FF7F7F] text-[0.8rem]">{errors.password.message}</p>
                        )}
                        <button className="w-full p-4 rounded-full cursor-pointer bg-[#A3CBFF] hover:bg-[#A3CBFF]/80 text-black" type="submit">
                            Sign in
                        </button>
                    </div>
                    <p className="text-nowrap text-gray-400">
                        Don't have an account? <Link className="underline text-white" href="/register">
                            Create one here.
                        </Link>
                    </p>
                </SignCard>
            </div>
        </form>
    )
}


