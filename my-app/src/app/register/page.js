"use client"
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from "next/navigation";

import RegisterStep0 from '../components/registerStep0';
import RegisterStep1 from '../components/registerStep1';

export default function Register() {
    const router = useRouter();

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
            // await signUp({ email, username, password });
            router.push("/");
        } catch (err) {
            alert(`Signup failed: ${err.message}`);
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

