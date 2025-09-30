"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';

export default function Home() {
  const [recommendedEvents, setRecommendedEvents] = useState([
    {
      title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"
    },  {
      title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"
    }, {
      title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"
    }
  ])


  const [allEvents, setAllEvents] = useState([
    {
      title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"
    }, 
  ])
  return (
    <div className="min-h-screen w-full flex justify-center pt-24">
      <div className="w-5xl flex flex-col">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="border border-gray-700 py-2 pl-4 pr-2 rounded-full cursor-pointer hover:bg-gray-800 transition-all duration-200">
                Categories <KeyboardArrowDownOutlinedIcon/>
              </div>
              <div className="border border-gray-700 py-2 pl-4 pr-2 rounded-full cursor-pointer hover:bg-gray-800 transition-all duration-200">
                Recency <KeyboardArrowDownOutlinedIcon/>
              </div>
            </div>
            <div className="border-l-1 pl-4">
              <span className="cursor-pointer">
                Name<KeyboardArrowDownOutlinedIcon/>
              </span>
            </div>
          </div>
        </div>
        <div className="ml-2">
          <h1 className="text-4xl font-semibold my-8">
            Recommended
          </h1>
          <div className="grid grid-cols-3 gap-8">
            {recommendedEvents.map((eventData, index) => {
              return <EventCard key={index} eventData={eventData}/>
            })}
          </div>
        </div>
        <div className="ml-2">
          <h1 className="text-4xl font-semibold my-8">
            All Events
          </h1>
          <div className="grid grid-cols-3 gap-8">
            {allEvents.map((eventData, index) => {
              return <EventCard key={index} eventData={eventData}/>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


function EventCard({eventData}) {
  useEffect(() => {
    console.log(eventData)
  }, [])
  return (
    <div className="w-full hover:scale-105 transition-all cursor-pointer">
        <div className={`w-full h-40 bg-gray-400 rounded-xl bg-cover bg-center flex items-end p-4 group`}
          style={{ backgroundImage: `url(${eventData.picture})` }}
        >
          <div className="w-full justify-between text-center text-black text-xs gap-4 opacity-0 flex group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <div className="w-full bg-white flex items-center justify-center py-2 rounded-xl gap-1 hover:bg-[#d9dce1] ">
              Add to Calender <CalendarTodayOutlinedIcon fontSize="small"/>
            </div>
            <div className="w-full bg-[#A3CBFF] flex items-center justify-center py-2 rounded-xl gap-1 hover:bg-[#99bae4]">
              Want to network <LanOutlinedIcon fontSize="small"/>
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