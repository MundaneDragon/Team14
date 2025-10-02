"use client"
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import { useAtom } from 'jotai';
import { networkAtom } from "@/app/atoms/networkAtom";
import { updateNetwork } from '@/lib/fetch';
import { useState } from 'react';

export default function NetworkButton({ className = "", eventId }) {
  const [network, setNetwork] = useAtom(networkAtom);
  const [clicked, setClicked] = useState(false);
  return (
    <button
      className={`w-full bg-[#A3CBFF] flex items-center justify-center py-2 rounded-full gap-1 hover:bg-[#99bae4] shadow-xl text-black cursor-pointer ${className} transition-all duration-300 ease-in-out`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        const newNetwork = [...network, eventId];

        setNetwork(newNetwork);
        updateNetwork(eventId);
      }}
    >
      Want to Network <LanOutlinedIcon fontSize="small" />
    </button>
  )
}
