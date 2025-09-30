import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Link from "next/link";

export default function NavBar() {

    return (
        <div className="absolute w-full bg-[#101727] border-b-1 border-gray-800">
            <div className="p-4 justify-between md:flex hidden">
                <div className="flex justify-center gap-12">
                    <div className="flex gap-2 items-center cursor-pointer">
                        <img src="/googleiconrm.png" className="w-8 h-8" />
                        <h1 className="font-bold text-xl">
                            NetHub
                        </h1>
                    </div>
                    <div className="flex items-center text-gray-300 gap-8">
                        <Link className='flex gap-2 cursor-pointer hover:text-gray-200'
                        href="/">
                            <HomeOutlinedIcon/>
                            Events
                        </Link>
                        <Link className='flex gap-2 cursor-pointer hover:text-gray-200'
                        href="/societies">
                            <Groups2OutlinedIcon/>
                            Societies
                        </Link>
                    </div>
                </div>
                <div className="flex gap-4 font-semibold">
                    <button className="bg-blue-400/90 p-2 rounded w-24 cursor-pointer hover:bg-blue-400/80 ">
                        Register
                    </button>
                    <button className="bg-white/90 p-2 rounded w-24 cursor-pointer hover:bg-white/80 text-black ">
                        Login 
                    </button>
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
                    <MenuOutlinedIcon/>
                </div>
            </div>
        </div>  
    )
    
    
}