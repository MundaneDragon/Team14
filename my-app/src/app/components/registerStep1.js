import SignCard from "../components/signCard"
import { Input } from "../components/input";
import { useFormContext } from 'react-hook-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function RegisterStep1({ prevStep, onSubmit }) {
    const { register, handleSubmit, formState: { errors } } = useFormContext();

    return (
        <div className="flex w-full h-dvh justify-center items-center">
            <SignCard>
                <h1 className="text-4xl font-semibold text-nowrap my-16">
                    Complete your account
                </h1>

                <div className="flex flex-col w-full gap-4 mb-16">
                  <Input 
                    {...register("username", {
                      required: "Username is required"
                    })}
                    type="username" 
                    id="username" 
                    className={`bg-[#282828] p-4 w-full rounded-3xl ${errors.username && "border-[#FF7F7F]"}`}
                    placeholder="Enter a username"
                  />
                  {errors.username && (
                    <p className="text-[#FF7F7F] text-[0.8rem]">{errors.username.message}</p>
                  )}

                  <Input 
                    {...register("password", {
                      required: "Password is required"
                    })}
                    type="password" 
                    id="password"
                    className={`bg-[#282828] p-4 w-full rounded-3xl ${errors.password && "border-[#FF7F7F]"}`}
                    placeholder="Enter a password"
                  />
                  {errors.password && (
                    <p className="text-[#FF7F7F] text-[0.8rem]">{errors.password.message}</p>
                  )}

                  <button className="w-full p-4 rounded-full bg-[#A3CBFF] hover:bg-[#A3CBFF]/80 text-black cursor-pointer" onClick={handleSubmit(onSubmit)}>
                    Sign up
                  </button>
                  <button onClick={prevStep} className="cursor-pointer text-gray-400 hover:text-gray-300 mt-12">
                    <ArrowBackIcon /> Go Back
                  </button>
                  
                </div>
            </SignCard>
        </div>
    )
}
