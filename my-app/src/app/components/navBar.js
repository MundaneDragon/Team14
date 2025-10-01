"use client"
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HubIcon from '@mui/icons-material/Hub';
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { Pencil1Icon } from "@radix-ui/react-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { 
    HoverCard, 
    HoverCardTrigger, 
    HoverCardContent 
} from "./hoverCard";
import { Input } from './input';
import { uploadImage, fetchAvatar } from '@/lib/fetch';
import { useAtom } from 'jotai';
import { avatarAtom } from "@/app/atoms/avatarAtom";

export default function NavBar() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [avatar, setAvatar] = useAtom(avatarAtom);

    useEffect(() => {
        const handleFetch = async () => {
            try {
                if (!avatar) {
                    const fetchedAvatar = await fetchAvatar();
                    setAvatar(fetchedAvatar);
                }
            } catch (err) {
                alert(err.message);
            }
        };
    
        handleFetch();
    }, [avatar])

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleUpload = async ({ e }) => {
        try {
            const newAvatar = await uploadImage({ e });
            setAvatar(newAvatar);
        } catch (err) {
            alert(err.message);
        }
    }

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    console.log(avatar);

    return (
        <div className=" z-10 w-full  top-0 left-0 right-0 bg-[#101727]/50 border-b-1 border-gray-800 fixed backdrop-blur-lg">
            <div className="py-4 px-6 justify-between md:flex hidden">
                <div className="flex justify-center gap-12">
                    <div className="flex gap-8 items-center cursor-pointer">
                        <Link className="font-bold text-xl" href="/">
                            MissingLink
                        </Link>

                        <Link className='flex gap-2 cursor-pointer text-gray-500 hover:text-white transition-all duration-300 ease-in-out'
                        href="/societies">
                            Societies
                        </Link>
                        <Link className='flex gap-2 cursor-pointer text-gray-500 hover:text-white transition-all duration-300 ease-in-out'
                        href="/network">
                            {/* <HubIcon/> */}
                            Network
                        </Link>
                        
                    </div>
                </div>
                <div className="flex gap-4 font-semibold items-center">
                    {loading ? (
                        <div className="text-gray-400">Loading...</div>
                    ) : user ? (
                        <>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <div className="relative w-12 h-12 rounded-full border-2 border-white cursor-pointer aspect-square">
                                        <div
                                            className="w-full h-full rounded-full bg-cover bg-center"
                                            style={avatar && { backgroundImage: `url(${avatar})` }}
                                        />

                                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 hover:opacity-50 flex items-center justify-center transition-opacity duration-300"
                                            onClick={() => document.getElementById("avatar").click()}
                                        >
                                            <Pencil1Icon className="w-5 h-5"/>
                                        </div>

                                        <Input
                                            type="file"
                                            id="avatar"
                                            className="hidden"
                                            onChange={(e) => handleUpload({ e })}
                                        />
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="flex flex-col gap-2 bg-white border-0">
                                    <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                        <span className="text-[1.1rem]">iCal Link</span>
                                    </div>

                                    {/* <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                        <span className="text-[1.1rem]">Following</span>
                                    </div>

                                    <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                        <span className="text-[1.1rem]">Settings</span>
                                    </div> */}

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full bg-red-500/90 p-2 rounded-full cursor-pointer hover:bg-red-500/80"
                                    >
                                        Log out
                                    </button>
                                </HoverCardContent>
                            </HoverCard>
                        </>
                    ) : (
                        <>
                            <Link href="/register">
                                <button className="bg-blue-400/90 p-2 rounded w-24 cursor-pointer hover:bg-blue-400/80 ">
                                    Register
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="bg-white/90 p-2 rounded w-24 cursor-pointer hover:bg-white/80 text-black ">
                                    Login 
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className="p-4 flex justify-between md:hidden items-center">
                <div className="flex gap-2 items-center">
                    <h1 className="font-bold text-xl">
                        MissingLink
                    </h1>
                </div>
                <div className='cursor-pointer text-2xl flex items-center'> 
                    <Popover>
                        <PopoverTrigger>
                            <div className="relative w-12 h-12 rounded-full border-2 border-white cursor-pointer aspect-square">
                                <div
                                    className="w-full h-full rounded-full bg-cover bg-center"
                                    style={avatar && { backgroundImage: `url(${avatar})` }}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col gap-2 bg-white border-0">
                            <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                <span className="text-[1.1rem]" onClick={() => router.push("/societies")}>Societies</span>
                            </div>

                            <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                <span className="text-[1.1rem]" onClick={() => router.push("/network")}>Network</span>
                            </div>

                            <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                <span className="text-[1.1rem]">iCal Link</span>
                            </div>

                            <button 
                                onClick={handleLogout}
                                className="w-full bg-red-500/90 p-2 rounded-full cursor-pointer hover:bg-red-500/80"
                            >
                                Log out
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>  
    )
    
    
}