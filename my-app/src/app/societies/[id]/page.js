"use client"
import MainBody from '@/app/components/mainBody'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// import StarIcon from '@mui/icons-material/Star';
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons"
import EmailIcon from '@mui/icons-material/Email';
import EventCard from '@/app/components/eventCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTriggerSort
} from "@/app/components/select";
import { useAtom } from 'jotai';
import { societiesAtom } from "@/app/atoms/societiesAtom";
import { favouritesAtom } from "@/app/atoms/favouritesAtom";
import { fetchSocieties, updateFavourites } from '@/lib/fetch';

// const fakeData = {
// 		id: 2309322,
// 		name: "180 Accounting",
// 		image: "/societylogo.webp",
//     desc: `180 Degrees Consulting is the world’s largest pro bono student  consultancy that helps nonprofits achieve a \
//           greater social impact across 35 countries and 170+ branches. Teams of university students work  throughout the semester \
//           to identify and overcome the challenges these  organisations face.   The 180DC UOW team has completed projects for the \
//           Green Connect, The  Gong Bar, UOW Pulse Cancer Council, Illawarra Public Health Society,  Healthy Cities Illawarra, \
//           and #Talk2MeBro.  This is an amazing opportunity for students wishing to gain new skills  and experience to put their learning\
//            into practice. With previous team  members now employed in top tier organisations worldwide, students do  not want to miss out 
//            on the ability to enhance their positive social  impact by helping non-profit and social enterprises.   If you're a UOW student \
//            looking to give back to the community, gain  professional experience and exercise your leadership skills\
//            into practice. With previous team  members now employed in top tier organisations worldwide, students do  not want to miss out \
//            on the ability to enhance their positive social  impact by helping non-profit and social enterprises.   If you're a UOW student \
//            looking to give back to the community, gain  professional experience and exercise your leadership skills`,
//     events: [
//       {title: "2025 CEUS AGM", 
//       clubLogo: "/society.webp", 
//       society: "UNSW Chemical Engineering Undergraduate Society",
//       time: "9 Oct 2024, 6:00 PM", 
//       picture: "/society.webp"}, 
//       {title: "2025 CEUS AGM", 
//       clubLogo: "/society.webp", 
//       society: "UNSW Chemical Engineering Undergraduate Society",
//       time: "9 Oct 2024, 6:00 PM", 
//       picture: "/society.webp"}, 
//       ]
// }
// const fav = [32321, 2309322, 219839321, 29183]

export default function Society() {
  const [societyData, setSocietyData] = useState(null);
  const [favourites, setFavourites] = useAtom(favouritesAtom);
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
      } catch (err) {
        alert(err.message);
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
              <div className={`h-54 w-54 bg-gray-400 rounded-full bg-cover bg-center flex items-end justify-end `}
                style={societyData.image && { backgroundImage: `url(${societyData.image})` }}
              >
                <div className="h-12 w-12 rounded-full bg-[#101727] flex items-center justify-center cursor-pointer hover:scale-105"
                  onClick={
                      (e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          let newFavourites;
                          
                          if (favourites.includes(societyData.id)) {
                              newFavourites = favourites.filter((fav => fav !== societyData.id));
                          } else {
                              newFavourites = [...favourites, societyData.id];
                          }
      
                          setFavourites(newFavourites);
                          updateFavourites(newFavourites);
                      }
                  }
                  >
                      {favourites.includes(societyData.id) ? (
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
      {/* {societyData.events.map((data, index) => {
        return <EventCard key={index} eventData={data} />
      })} */}
    </div>
  </MainBody>)
}