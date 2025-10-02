"use client"
import MainBody from '@/app/components/mainBody'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// import StarIcon from '@mui/icons-material/Star';
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons"
import EmailIcon from '@mui/icons-material/Email';
import EventCard from '@/app/components/eventCard';
import EventModal from '@/app/components/eventModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTriggerSort
} from "@/app/components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/dialog";
import { useAtom } from 'jotai';
import { societiesAtom } from "@/app/atoms/societiesAtom";
import { favouritesAtom } from "@/app/atoms/favouritesAtom";
import { eventsAtom } from "@/app/atoms/eventsAtom";
import { fetchSocieties, updateFavourites, fetchFavourites, fetchEvents } from '@/lib/fetch';

export default function Society() {
  const [societyData, setSocietyData] = useState(null);
  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [events, setEvents] = useAtom(eventsAtom);
  const [sort, setSort] = useState("Name A-Z");

  const { id } = useParams();
  const [societies, setSocieties] = useAtom(societiesAtom);
  
  useEffect(() => {
    const handleFetch = async () => {
      try {
        let foundSociety = societies.find(society => society.id === Number(id));
        if (!foundSociety) {
          const fetchedSocieties = await fetchSocieties();
          foundSociety = fetchedSocieties.find(soc => soc.id === Number(id));
          setSocieties(prev => [...prev, foundSociety]);
        }
        console.log(foundSociety);
        setSocietyData(foundSociety);

        if (!favourites) {
          const data = await fetchFavourites();
          setFavourites(data.favourite_societies);
        }

        let foundEvent = events.find(event => event.society_id === Number(id));
        if (!foundEvent) {
          const fetchedEvents = await fetchEvents();
          setEvents(fetchedEvents);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    handleFetch();
  }, [])

  if (!societyData) {
    return;
  }
  
  return (
  <MainBody>
    <div className='w-full bg-gray-600/20 rounded-xl lg:h-96 flex flex-col lg:flex-row p-4 items-center gap-8'>
      <div className='flex flex-col gap-4 items-center'>
          <div className="w-full flex flex-col gap-4 items-center p-2 rounded-xl">
              <div className={`h-54 w-54 bg-gray-500 rounded-full bg-cover bg-center flex items-end justify-end relative `}
                style={societyData.image && { backgroundImage: `url(${societyData.image})` }}
              >
                {!societyData.image && (
                    <div className="absolute right-[25%] bottom-[25%] flex flex-col w-[50%] h-[50%] text-black text-3xl font-bold items-center justify-center">
                        <span>NO</span>
                        <span>IMAGE</span>
                    </div>
                )}
                <div className="h-12 w-12 rounded-full bg-[#101727] flex items-center justify-center cursor-pointer hover:scale-105"
                  onClick={
                      (e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          let newFavourites = [];
                          
                          if (favourites?.includes(societyData.id)) {
                              newFavourites = favourites?.filter((fav => fav !== societyData.id));
                          } else {
                              newFavourites = [...favourites, societyData.id];
                          }
      
                          setFavourites(newFavourites);
                          updateFavourites(newFavourites);
                      }
                  }
                  >
                      {favourites?.includes(societyData.id) ? (
                          <StarFilledIcon className="w-6 h-6 text-[#FFDFA3]"/>
                      ) : (
                          <StarIcon className="w-6 h-6 text-[#FFFFFF]"/>
                      )}
                  </div>
              </div>
          </div>
      </div>
      <div className='flex flex-col gap-8'>
        <h1 className='font-semibold text-3xl '>
          {societyData.name}
        </h1>
        <p className='h-54 overflow-auto'>
          {societyData.description}
        </p>
      </div>
    </div>
    <div className='w-full flex justify-end pt-8'>
      <div className="border-l-1 pl-4">
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
    <h2 className="text-2xl font-semibold my-4 w-min text-nowrap ">
      Upcoming Events
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((data, index) => {
        console.log(data.society_id, id);
        if (data.society_id === Number(id)) {
          return <Dialog key={index}>
            <DialogTrigger className="flex">
              <EventCard key={index} eventData={data}/>
            </DialogTrigger>
            <DialogContent>
              <EventModal eventData={data} />
            </DialogContent>
          </Dialog>
        }
      })}
    </div>
  </MainBody>)
}