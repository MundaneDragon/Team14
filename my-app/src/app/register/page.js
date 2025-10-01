"use client"
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";

import RegisterStep0 from '../components/registerStep0';
import RegisterStep1 from '../components/registerStep1';

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            setError(err.message || "Signup failed. Please try again.");
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
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {steps[step]}
            </form>
        </FormProvider>
    )
}

