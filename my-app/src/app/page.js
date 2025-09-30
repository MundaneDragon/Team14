"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import EventCard from "./components/eventCard";
import MainBody from "./components/mainBody";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTriggerSort
} from "./components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog";

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
  const [category, setCategory] = useState("");
  const [recency, setRecency] = useState("");
  const [sort, setSort] = useState("Name A-Z");
  const [recommendedEvents, setRecommendedEvents] = useState(rec);
  const [allEvents, setAllEvents] = useState(all);


  return (
    <MainBody>
        <div>
          <div className="flex justify-between items-center pb-4">
            <div className="flex gap-2">
              <Select value={category} onValueChange={(val) => setCategory(val === "Any" ? "" : val)}>
                <SelectTrigger className={category && "bg-white text-black"}>
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any" className="text-[rgba(0,0,0,0.25)]">Any</SelectItem>
                  <SelectItem value="Ball/Dinner/Gala">Ball/Dinner/Gala</SelectItem>
                  <SelectItem value="Class/Workshop">Class/Workshop</SelectItem>
                  <SelectItem value="Cruise">Cruise</SelectItem>
                  <SelectItem value="Industry/Career">Industry/Career</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Party/BBQ/Social">Party/BBQ/Social</SelectItem>
                  <SelectItem value="Sport/Competition">Sport/Competition</SelectItem>
                  <SelectItem value="Trip/Camp">Trip/Camp</SelectItem>
                </SelectContent>
              </Select>

              <Select value={recency} onValueChange={(val) => setRecency(val === "Any" ? "" : val)}>
                <SelectTrigger className={recency && "bg-white text-black"}>
                  <SelectValue placeholder="Recency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any" className="text-[rgba(0,0,0,0.25)]">Any</SelectItem>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-l-1 ml-4">
              <Select value={sort} onValueChange={(val) => setSort(val)}>
                <SelectTriggerSort>
                  <SelectValue />
                </SelectTriggerSort>
                <SelectContent>
                  <SelectItem value="Name A-Z">Name A-Z</SelectItem>
                  <SelectItem value="Name Z-A">Name Z-A</SelectItem>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Soonest">Soonest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-8 mt-4 w-min">
            Recommended
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedEvents.map((eventData, index) => (
              <Dialog>
                <DialogTrigger>
                  <EventCard key={index} eventData={eventData}/>
                </DialogTrigger>
                <DialogContent>
                  <div className="w-[160px] h-[40px] bg-red-500" />
                </DialogContent>
              </Dialog>
            ))}
          </div>
          {recommendedEvents.length === 0 && 
            <div className="text-white/60 flex flex-col w-full items-center">
              No recommendations yet. 
              <span> 
                Follow societies to receive recommendations!
              </span>
            </div>
          }
        </div>
        <div className="">
          <h1 className="text-3xl lg:text-4xl font-semibold my-8 w-min text-nowrap ">
            All Events
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allEvents.map((eventData, index) => (
              <EventCard key={index} eventData={eventData}/>
            ))}
          </div>
          {allEvents.length === 0 && 
            <div className="text-white/60 flex flex-col w-full items-center">
              We couldn't find any matching results. 
              <span> 
                Please try a different search criteria.
              </span>
            </div>
          }
        </div>
    </MainBody>
  );
}
