"use client";
import MainBody from "../components/mainBody"
import CloseIcon from '@mui/icons-material/Close';
import Link from "next/link";
export default function Network() {
    return (
        <MainBody>
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold py-2 ml-7">
                    Planned Networking Events
                </h1>
                <div className="flex flex-col gap-2">
                    <NetworkCard/>
                    <NetworkCard/>
                    <NetworkCard/>
                </div>
            </div>
        </MainBody>
    )
}



function NetworkCard({data}) {
    return (
    <Link className="flex flex-col md:flex-row gap-4 p-4 hover:bg-gray-400/20 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300"
    href="/network/2121">
        <div className="flex gap-2 items-center">
            <div className="h-10/12 w-1 bg-red-300 rounded-md">
            </div>
            <img src="/society.webp" className="w-80 h-42 rounded-md"/>
        </div>
        <div className="flex flex-col justify-between">
            <div className="">
                <h2 className="font-semibold text-xl">
                    2025 CEUS AGM
                </h2>
                <div className="mt-4 flex flex-col text-gray-400">
                    <p>
                        Happening in 10 min
                    </p>
                    <p>
                        20 people planning to network
                    </p>
                </div>
            </div>
            <button className="bg-[#FFA3A3] w-64 rounded-md text-black py-2 cursor-pointer hover:bg-[#f58888] flex justify-center items-center gap-2"
            onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
            }}>
                Remove 
                <div className="pt-0.5">
                    <CloseIcon/>
                </div>
            </button>
        </div>
    </Link>
    )
}