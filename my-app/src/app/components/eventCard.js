"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';

export default function EventCard({eventData}) {
  const [openModal, setOpenModal] = useState(true);

  useEffect(() => {
    console.log(eventData)
  }, [])

  return (
    <div className="w-full hover:scale-105 transition-all cursor-pointer group duration-300 hover:bg-gray-400/20 p-2 rounded-xl">
        <div className={`w-full h-40 bg-gray-400 rounded-xl bg-cover bg-center flex items-end p-4 `}
          style={{ backgroundImage: `url(${eventData.picture})` }}
        >
          <div className="w-full justify-between text-center text-black text-xs gap-4 opacity-0 flex group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <div className="w-full bg-white flex items-center justify-center py-2 rounded-xl gap-1 hover:bg-[#d9dce1] shadow-xl"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}>
              Add to Calendar <CalendarTodayOutlinedIcon fontSize="small"/>
            </div>
            <div className="w-full bg-[#A3CBFF] flex items-center justify-center py-2 rounded-xl gap-1 hover:bg-[#99bae4] shadow-xl"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}>
              Want to Network <LanOutlinedIcon fontSize="small"/>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 items-center">
          <img src={eventData.clubLogo} className="w-6 h-6 rounded-sm"/>
          <div className="flex flex-col ">
            <h2 className="font-semibold">
              {eventData.title}
            </h2>
            <div className="flex flex-col text-gray-400 text-xs">
              <p className="">
                {eventData.society}
              </p>
              <p>
                {eventData.time}
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}
