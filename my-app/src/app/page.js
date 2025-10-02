"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import EventCard from "./components/eventCard";
import MainBody from "./components/mainBody";
import EventModal from "./components/eventModal";
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
import SearchBar from "./components/searchBar";
import { fetchEvents, fetchFavourites } from "@/lib/fetch";
import { useAtom } from 'jotai';
import { eventsAtom } from "@/app/atoms/eventsAtom";
import { favouritesAtom } from "./atoms/favouritesAtom";
import { Search } from "lucide-react";
import { Toaster } from 'react-hot-toast'

const EventCardSkeleton = () => {
  return (
    <div className="w-full transition-all duration-300 p-2 rounded-xl animate-pulse">
      <div className="w-full h-40 bg-gray-400 rounded-xl relative"></div>
    </div>
  );
};

export default function Home() {
  const [category, setCategory] = useState("");
  const [recency, setRecency] = useState("");
  const [sort, setSort] = useState("Soonest");
  const [allEvents, setAllEvents] = useAtom(eventsAtom);
  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [displayEvents, setDisplayEvents] = useState([])
  const [currentMax, setCurrentMax] = useState(36)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleFetch = async () => {
      try {
        let events = await fetchEvents();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        events = events.filter(e => {
          const start = new Date(e.start_time);
          return start >= today; 
        });

        setAllEvents(applySort(events, sort));

        if (!favourites) {
          const data = await fetchFavourites();
          setFavourites(data.favourite_societies);
        }

        console.log(events);
      } catch (err) {
        console(err.message);
      } finally {
        setLoading(false)
      }
    };

    handleFetch();
  }, [])

  useEffect(() => {
    console.log(currentMax)
    if (category !== "" || search !== "" || recency !== "") {
      // If one of the filters is active we display according to the filter
      const filteredEvents = []
      for (const event of allEvents) {
        let valid = false 
        if (category !==  "") {
          // If category is defined we need category + search term to match
          if (
            event.category === category && 
            (event.title.toLowerCase().includes(search.toLowerCase()) || 
            event.societies.name.toLowerCase().includes(search.toLowerCase()))
          ) {
            valid = true 
          }
        } else {
          // Just need to search term to match
          if (event.title.toLowerCase().includes(search.toLowerCase()) ||
           event.societies.name.toLowerCase().includes(search.toLowerCase())) {
            valid = true
          }
        }

        if (valid === false) {
          continue 
        }

        // The current event matches the search term + category, now checks the date 
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); 
        startOfWeek.setHours(0,0,0,0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        
        const currentDate = new Date(event.start_time)
        if (recency === "Today") {
          if (currentDate >= startOfDay && currentDate < endOfDay) {
            filteredEvents.push(event)
          }
        } else if (recency === "This Week") {
          if (currentDate >= startOfWeek && currentDate < endOfWeek) {
            filteredEvents.push(event)
          }
        } else if (recency === "This Month") {
          if (currentDate >= startOfMonth && currentDate < endOfMonth) {
            filteredEvents.push(event)
          }
        } else {
          filteredEvents.push(event)
        }

      }
      console.log("Filtered events are", filteredEvents, "and category is", category)
      setDisplayEvents(filteredEvents)
    } else {
      // If no filters are active we default to the infinite scrolling
      setDisplayEvents(allEvents.slice(0, Math.min(currentMax, allEvents.length)))
    }
    
  }, [currentMax, allEvents, category, search, recency])

  const applySort = (array, sortBy) => {
    const newArr = [...array]
    console.log("The new arr is", newArr[0])
    console.log("The sort by is", sortBy)
    if (sortBy === "Name A-Z") {
      newArr.sort((a, b) => a.title.localeCompare(b.name));
    } else if (sortBy === "Name Z-A") {
      newArr.sort((a, b) => b.title.localeCompare(a.name));
    } else if (sortBy === "Latest") {
      console.log("Trying to sort by latest")
      newArr.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
    } else if (sortBy === "Soonest") {
      console.log("Trying to sort by soonest")
      newArr.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    }

    return newArr
  }

  useEffect(() => {
    setAllEvents(prev => applySort(prev, sort))
  }, [sort])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 200) {
        setCurrentMax(prev => prev + 36) 
      }

    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <MainBody>
      <Toaster position="bottom-left" />
        <div>
          <div className="flex justify-between items-center pb-4 md:flex-row flex-col gap-4">
            <div className="flex gap-2 md:flex-row flex-col">
              <SearchBar placeholder="Search Event or Society" setSearch={setSearch}/>
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
                  <SelectItem value="Soonest">Soonest</SelectItem>
                  <SelectItem value="Name A-Z">Name A-Z</SelectItem>
                  <SelectItem value="Name Z-A">Name Z-A</SelectItem>
                  <SelectItem value="Latest">Latest</SelectItem>
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
            {allEvents?.map((eventData, index) => {
              if (favourites?.includes(eventData.society_id)) {
                return <Dialog key={index}>
                  <DialogTrigger className="flex">
                    <EventCard key={index} eventData={eventData}/>
                  </DialogTrigger>
                  <DialogContent>
                    <EventModal eventData={eventData} />
                  </DialogContent>
                </Dialog>
              }
            })}
          </div>
          {favourites?.length === 0 && 
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
            {loading 
              ? Array.from({ length: 20 }).map((_, index) => (
                <EventCardSkeleton key={index}/>
              )) 
            : displayEvents?.map((eventData, index) => {
              if (!favourites?.includes(eventData.society_id)) {
                return <Dialog key={index}>
                  <DialogTrigger className="flex">
                    <EventCard key={index} eventData={eventData}/>
                  </DialogTrigger>
                  <DialogContent>
                    <EventModal eventData={eventData} />
                  </DialogContent>
                </Dialog>
              }
            })}
          </div>
          {!loading && displayEvents?.length === 0 && 
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
