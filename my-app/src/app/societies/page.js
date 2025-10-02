"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import MainBody from "../components/mainBody";
import SocietyCard from "../components/societyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTriggerSort
} from "../components/select";
import SearchBar from "../components/searchBar";
import { fetchSocieties, fetchFavourites } from "@/lib/fetch";
import { useAtom } from 'jotai';
import { societiesAtom } from "@/app/atoms/societiesAtom";
import { favouritesAtom  } from "../atoms/favouritesAtom";


export default function Societies({}) {
  const [sort, setSort] = useState("Name A-Z");
  const [allSocieties, setAllSocieties] = useAtom(societiesAtom)
	const [favourites, setFavourites] = useAtom(favouritesAtom)
  const [displaySocieties, setDisplaySocieties] = useState([])
  const [currentMax, setCurrentMax] = useState(36)
  const [search, setSearch] = useState("")

	useEffect(() => {
    const handleFetch = async () => {
      try {
        const societies = await fetchSocieties();
        setAllSocieties(societies);
        setDisplaySocieties(societies.slice(0, 36))
        
        if (favourites.length == 0) {
          console.log("FETCHING FAVOURITES")
          const data = await fetchFavourites();
          setFavourites(data.favourite_societies);
        }
        
        console.log(societies);
        console.log("hello", favourites);
      } catch (err) {
        alert(err.message);
      }
    };
    
    handleFetch();
	}, [])
  
  useEffect(() => {
    console.log(currentMax)
    if (search !== "") {
      // If one of the filters is active we display according to the filter
      const filteredSocieties = []

      for (const soc of allSocieties) {
        if (soc.name.toLowerCase().includes(search.toLowerCase())) {
          filteredSocieties.push(soc)
        }
      }

      setDisplaySocieties(filteredSocieties)
    } else {
      // If no filters are active we default to the infinite scrolling
      setDisplaySocieties(allSocieties.slice(0, Math.min(currentMax, allSocieties.length)))
    }

    
    console.log(allSocieties)
  }, [currentMax, allSocieties, search])
  
  const applySort = (array, sortBy) => {
    const newArr = [...array]
    console.log("The new arr is", newArr[0])
    if (sortBy === "Name A-Z") {
      newArr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Name Z-A") {
      newArr.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "Latest") {
      newArr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "Oldest") {
      newArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return newArr
  }

  useEffect(() => {
    setAllSocieties(prev => applySort(prev, sort))
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
        <div>
          <div className="flex justify-between items-center border-gray-700 border-b-1 pb-4 md:flex-row flex-col gap-2">
            <div className="flex gap-2">
              <SearchBar placeholder="Search Societies" setSearch={setSearch}/>
            </div>
            <div className="border-l-1">
              <Select value={sort} onValueChange={(val) => setSort(val)}>
                <SelectTriggerSort>
                  <SelectValue />
                </SelectTriggerSort>
                <SelectContent>
                  <SelectItem value="Name A-Z">Name A-Z</SelectItem>
                  <SelectItem value="Name Z-A">Name Z-A</SelectItem>
                  <SelectItem value="Latest">Newest</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="ml-2">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-8 mt-4 w-min">
            Favourites
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allSocieties.map((data, index) => {
              if (favourites?.includes(data.id)) {
                return <SocietyCard key={index} data={data} favourites={favourites} setFavourites={setFavourites}/>;
              }
            })}
          </div>
          {favourites?.length === 0 && 
            <div className="text-white/60 flex flex-col w-full items-center">
              You haven't favourited any societies yet.
            </div>
          }
        </div>
        <div className="ml-2">
          <h1 className="text-3xl lg:text-4xl font-semibold my-8 w-min text-nowrap ">
            All Societies
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displaySocieties.map((data, index) => {
              if (!favourites?.includes(data.id)) {
                return <SocietyCard key={index} data={data} favourites={favourites} setFavourites={setFavourites}/>;
              }
            })}
          </div>
          {displaySocieties.length === 0 && 
            <div className="text-white/60 flex flex-col w-full items-center">
              We couldn't find any matching results. 
              <span> 
                Please try a different search criteria
              </span>
            </div>
          }
        </div>
    </MainBody>
  );
}