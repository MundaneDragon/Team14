"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import EventCard from "./components/eventCard";

const all = [
  {title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"}, 
      
    {title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"},
    {title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"},
    {title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"},
    {title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"},
    {title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"}
]

const rec = [
  {title: "2025 CEUS AGM", 
      clubLogo: "/society.webp", 
      society: "UNSW Chemical Engineering Undergraduate Society",
      time: "9 Oct 2024, 6:00 PM", 
      picture: "/society.webp"}
]

export default function Home() {
  const [recommendedEvents, setRecommendedEvents] = useState(rec)
  const [allEvents, setAllEvents] = useState(all)
  return (
    <div className="min-h-screen w-full flex justify-center pt-24 pb-12 px-4">
      <div className="w-5xl flex flex-col">
        <div>
          <div className="flex justify-between items-center border-gray-700 border-b-1 pb-4">
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
          <h1 className="text-3xl lg:text-4xl font-semibold mb-8 mt-4 w-min">
            Recommended
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedEvents.map((eventData, index) => {
              return <EventCard key={index} eventData={eventData}/>
            })}
          </div>
        </div>
        <div className="ml-2">
          <h1 className="text-3xl lg:text-4xl font-semibold my-8 w-min text-nowrap ">
            All Events
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allEvents.map((eventData, index) => {
              return <EventCard key={index} eventData={eventData}/>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
