import SignCard from "../components/signCard"
import { Input } from "../components/input";
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function RegisterStep1({ prevStep, onSubmit }) {
    const methods = useFormContext();
    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitted }, watch, trigger } = methods;
    const [showErrors, setShowErrors] = useState(false);
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const isValid = await trigger();
        
        if (!isValid) {
            setShowErrors(true);
            // Hide errors after 3 seconds
            setTimeout(() => setShowErrors(false), 3000);
            return;
        }
        
        try {
            await handleSubmit(onSubmit)();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

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
                  {showErrors && errors.username && (
                    <div className="text-[#FF7F7F] text-[0.8rem] p-2 bg-red-50 rounded-md animate-fade-in">
                      {errors.username.message}
                    </div>
                  )}

                  <div className="w-full">
                    <Input 
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        },
                        validate: (value) => {
                          if (!/[A-Z]/.test(value)) {
                            return "Password must contain at least one uppercase letter";
                          }
                          if (!/[0-9]/.test(value)) {
                            return "Password must contain at least one number";
                          }
                          if (!/[!@#$%^&*]/.test(value)) {
                            return "Password must contain at least one special character (!@#$%^&*)";
                          }
                          return true;
                        }
                      })}
                      type="password" 
                      id="password"
                      className={`bg-[#282828] p-4 w-full rounded-3xl ${errors.password ? "border-[#FF7F7F]" : ""}`}
                      placeholder="Enter a password"
                    />
                    {showErrors && errors.password && (
                      <div className="text-[#FF7F7F] text-[0.8rem] p-2 bg-red-50 rounded-md mt-1 animate-fade-in">
                        {errors.password.message}
                      </div>
                    )}
                    <div className="text-gray-400 text-xs mt-1">
                      Password must be at least 6 characters and include:
                      <ul className="list-disc list-inside">
                        <li>One uppercase letter</li>
                        <li>One number</li>
                        <li>One special character (!@#$%^&*)</li>
                      </ul>
                    </div>
                  </div>

                  <button 
                    type="button"
                    className={`w-full p-4 rounded-full bg-[#A3CBFF] hover:bg-[#A3CBFF]/80 text-black cursor-pointer transition-colors ${isSubmitting ? 'opacity-70' : ''}`}
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing up...' : 'Sign up'}
                  </button>
                  <button onClick={prevStep} className="cursor-pointer text-gray-400 hover:text-gray-300 mt-12">
                    <ArrowBackIcon /> Go Back
                  </button>
                  
                </div>
            </SignCard>
        </div>
    )
}
