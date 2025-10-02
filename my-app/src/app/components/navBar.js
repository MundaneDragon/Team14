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
import { supabase } from '@/lib/supabase';

export default function NavBar() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [avatar, setAvatar] = useAtom(avatarAtom);
    const [icalUrl, setIcalUrl] = useState('');
    const [showIcalModal, setShowIcalModal] = useState(false);

    useEffect(() => {
        const handleFetch = async () => {
            try {
                if (!avatar) {
                    const fetchedAvatar = await fetchAvatar();
                    setAvatar(fetchedAvatar);
                }
            } catch (error) {
                console.error("Logout error:", error);
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

    const handleGetIcalLink = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const tokenResponse = await fetch('/api/ical/token', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const { icalUrl: url, error } = await tokenResponse.json();
            
            if (!error && url) {
                const webcalUrl = url.replace(/^https?:\/\//, 'webcal://');
                setIcalUrl(webcalUrl);
                setShowIcalModal(true);
            }
        } catch (error) {
            console.error('Failed to get iCal link:', error);
        }
    };

    const copyIcalLink = () => {
        navigator.clipboard.writeText(icalUrl);
        alert('Calendar link copied!');
    };

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
                            <img src="/logo.png" className="h-8"/>
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
                                    <div 
                                        onClick={handleGetIcalLink}
                                        className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer"
                                    >
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
                        <img src="/logo.png" className="h-8"/>
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
                        <PopoverContent className="flex flex-col gap-2 bg-white border-0 mr-4 ">
                            <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                <span className="text-[1.1rem]" onClick={() => router.push("/societies")}>Societies</span>
                            </div>

                            <div className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
                                <span className="text-[1.1rem]" onClick={() => router.push("/network")}>Network</span>
                            </div>

                            <div 
                                onClick={handleGetIcalLink}
                                className="flex flex-row items-center gap-5 hover:bg-accent p-2 rounded-md cursor-pointer">
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

            {/* iCal Modal */}
            {showIcalModal && (
                <div 
                    className="fixed inset-0 flex items-start justify-center z-[100] pt-24 sm:pt-32 px-4" 
                    onClick={() => setShowIcalModal(false)}
                >
                    <div 
                        className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg mb-8" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg sm:text-xl font-bold text-black mb-3">📅 Calendar Link</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4">
                            Copy and paste this link into your calendar app to sync events.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <input
                                type="text"
                                value={icalUrl}
                                readOnly
                                className="flex-1 bg-gray-50 text-black px-3 py-2 rounded-lg border-2 border-gray-300 text-xs font-mono overflow-x-auto"
                                onClick={(e) => e.target.select()}
                            />
                            <button
                                onClick={copyIcalLink}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-md whitespace-nowrap"
                            >
                                Copy
                            </button>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
                            <p className="text-xs text-blue-800">
                                <strong>Works with:</strong> Google Calendar, Apple Calendar, Outlook
                            </p>
                        </div>
                        <button
                            onClick={() => setShowIcalModal(false)}
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg font-semibold transition-colors text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>  
    )
}