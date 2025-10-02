"use client"
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";

import RegisterStep0 from '../components/registerStep0';
import RegisterStep1 from '../components/registerStep1';

// Simple error message that auto-dismisses
const ErrorMessage = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded z-50 max-w-md w-full shadow-lg flex items-center gap-2">
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-auto">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const methods = useForm({
        mode: "onSubmit",
        defaultValues: {
            email: "",
            username: "",
            password: "",
        }
    });

    const nextStep = async () => {
        const fieldsToValidate =
        step === 0 ? ["email"] :
        step === 1 ? ["username", "password"] : [];

        const valid = await methods.trigger(fieldsToValidate);
        if (valid) {
            setStep((prev) => prev + 1);
        }
    }
    const prevStep = () => setStep((prev) => prev - 1);

    const onSubmit = async ({ email, username, password }) => {
        try {
            setLoading(true);
            setError("");
            await signUp({ email, username, password });
            // Show success message
            alert("Account created successfully! Please check your email to verify your account.");
            router.push("/login");
        } catch (err) {
            const errorMessage = err.message || "Signup failed. Please try again.";
            setError(errorMessage);
            setShowError(true);
            console.error("Signup error:", err);
        } finally {
            setLoading(false);
        }
    }

    const [step, setStep] = useState(0);
    const steps = [
        <RegisterStep0 nextStep={nextStep} />, 
        <RegisterStep1 prevStep={prevStep} onSubmit={onSubmit} />
    ];

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="relative">
                {showError && (
                    <ErrorMessage 
                        message={error} 
                        onDismiss={() => setShowError(false)} 
                    />
                )}
                {steps[step]}
            </form>
        </FormProvider>
    )
}

