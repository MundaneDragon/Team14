"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';

import NetworkButton from "./networkButton";

export default function EventCard({ eventData }) {
  const { id, image, title, start_time, societies } = eventData;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    return `${date.toLocaleDateString(undefined, options)}, ${hours}:${minutes} ${ampm}`;
  }
  
  return (
    <div className="w-full hover:scale-105 transition-all cursor-pointer group duration-300 hover:bg-gray-400/20 p-2 rounded-xl">
        <div className={`w-full h-40 bg-gray-400 rounded-xl bg-cover bg-center flex items-end p-2 `}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="w-full justify-between text-center text-black text-xs gap-4 opacity-0 flex group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            {/* <div className="w-full bg-[#A3CBFF] flex items-center justify-center py-2 rounded-full gap-1 hover:bg-[#99bae4] shadow-xl"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}>
              Want to Network <LanOutlinedIcon fontSize="small"/>
            </div> */}
            <NetworkButton eventId={id} />
          </div>
        </div>
        <NetworkButton className="md:hidden" eventId={id} />
        {/* <div className="w-full md:hidden bg-[#A3CBFF] flex items-center justify-center py-2 my-4 rounded-full text-black gap-1 hover:bg-[#99bae4] shadow-xl">
            Want to Network <LanOutlinedIcon fontSize="small"/>
        </div> */}
        <div className="flex gap-2 mt-4 items-center">
          {societies.image && (
            <img src={societies.image} className="w-6 h-6 rounded-sm"/>
          )}
          <div className="flex flex-col pl-1">
            <h2 className="font-semibold text-left">
              {title}
            </h2>
            <div className="flex flex-col text-gray-400 text-xs text-left">
              <p className="">
                {societies.name}
              </p>
              <p>
                {formatTimestamp(start_time)}
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}
