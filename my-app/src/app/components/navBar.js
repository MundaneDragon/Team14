"use client"
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HubIcon from '@mui/icons-material/Hub';
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function NavBar() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <div className="absolute w-full bg-[#101727] border-b-1 border-gray-800">
            <div className="p-4 justify-between md:flex hidden">
                <div className="flex justify-center gap-12">
                    <div className="flex gap-8 items-center cursor-pointer">
                        <Link className="font-bold text-xl" href="/">
                            NetHub
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
                            <span className="text-gray-300">
                                {user.user_metadata?.username || user.email}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500/90 p-2 rounded w-24 cursor-pointer hover:bg-red-500/80"
                            >
                                Logout
                            </button>
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
                    <img src="/googleiconrm.png" className="w-8 h-8" />
                    <h1 className="font-bold text-xl">
                        NetHub
                    </h1>
                </div>
                <div className='cursor-pointer text-2xl flex items-center'> 
                    <div className="relative w-[4vw] h-[4vw] z-50 cursor-pointer m-3" onClick={toggleMenu}>
                        <span
                            className={`block absolute h-[0.4vw] w-full bg-white transform transition duration-300 ease-in-out ${
                            menuOpen ? 'rotate-45 top-[2.4vw]' : 'top-[0.8vw]'
                            }`}
                        />
                        <span
                            className={`block absolute h-[0.4vw] w-full bg-white transition-opacity duration-300 ease-in-out ${
                            menuOpen ? 'opacity-0 top-[2.4vw]' : 'top-[2.4vw]'
                            }`}
                        />
                        <span
                            className={`block absolute h-[0.4vw] w-full bg-white transform transition duration-300 ease-in-out ${
                            menuOpen ? '-rotate-45 top-[2.4vw]' : 'bottom-[-0.4vw]'
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>  
    )
    
    
}