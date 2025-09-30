import SignCard from "../components/signCard"
import TextField from '@mui/material/TextField';

export default function Register() {


    return (
        <div className="flex w-full h-dvh justify-center items-center">
            <SignCard>
                <img src="/googleiconrm.png" className="w-32 h-32"/>
                <h1 className="text-4xl font-semibold text-nowrap my-16">
                    Start <span className="text-[#A3CBFF]"> networking</span>
                </h1>
                <input  className="bg-[#282828] p-4 w-full rounded-xl" placeholder="Enter your email address"/>
                <button className="w-full p-4 rounded-xl my-4 bg-white/50">
                    Continue
                </button>
                <p className="text-nowrap text-gray-400">
                    Already have an account? <span className="underline text-white">
                        Log in here
                    </span>
                </p>
            </SignCard>
        </div>
    )
}

