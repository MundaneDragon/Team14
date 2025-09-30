import SignCard from "../components/signCard"
import { Input } from "../components/input";
import { useFormContext } from 'react-hook-form';
import Link from "next/link";

export default function RegisterStep0({ nextStep }) {
    const { register, formState: { errors }} = useFormContext();

    return (
        <div className="flex w-full h-dvh justify-center items-center">
            <SignCard>
                <img src="/googleiconrm.png" className="w-32 h-32"/>
                <h1 className="text-4xl font-semibold text-nowrap my-16">
                    Start <span className="text-[#A3CBFF]"> networking</span>
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
                  <button className="w-full p-4 rounded-full bg-white hover:bg-white/80 text-black cursor-pointer" onClick={nextStep}>
                      Continue
                  </button>
                </div>
                
                <p className="text-nowrap text-gray-400">
                    Already have an account? <Link className="underline text-white" href="/login">
                        Log in here.
                    </Link>
                </p>
            </SignCard>
        </div>
    )
}
