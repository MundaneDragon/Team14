"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
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
import { fetchSocieties, fetchFavourites } from "@/lib/fetch";
import { supabase } from "@/lib/supabase";
import { useAtom } from 'jotai';
import { societiesAtom } from "@/app/atoms/societiesAtom";
import { favouritesAtom  } from "../atoms/favouritesAtom";

export default function Societies({}) {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Name A-Z");
  const [downloading, setDownloading] = useState(false);
  const [allSocieties, setAllSocieties] = useAtom(societiesAtom)
	const [favourites, setFavourites] = useAtom(favouritesAtom)
  const [displaySocieties, setDisplaySocieties] = useState([])
  const [currentMax, setCurrentMax] = useState(36)

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

  const handleDownloadCalendar = async () => {
    setDownloading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to download your calendar');
        return;
      }

      // Get iCal token
      const tokenResponse = await fetch('/api/ical/token', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const { icalUrl, error } = await tokenResponse.json();
      console.log(icalUrl);
      if (error) {
        alert('Failed to get calendar token: ' + error);
        return;
      }

      // Download calendar file
      const link = document.createElement('a');
      link.href = icalUrl;
      link.download = 'missinglink-events.ics';
      link.click();
    } catch (error) {
      alert('Failed to download calendar: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };
  useEffect(() => {
    console.log(currentMax)
    setDisplaySocieties(allSocieties.slice(0, Math.min(currentMax, allSocieties.length)))
    console.log(allSocieties)
  }, [currentMax, allSocieties])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 100) {
        setCurrentMax(prev => prev + 28) 
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
          <div className="flex justify-between items-center border-gray-700 border-b-1 pb-4">
            <div className="flex gap-2">
              <Select value={category} onValueChange={(val) => setCategory(val === "Any" ? "" : val)}>
                <SelectTrigger className={category && "bg-white text-black"}>
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any" className="text-[rgba(0,0,0,0.25)]">Any</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Academic and Professional">Academic and Professional</SelectItem>
                  <SelectItem value="Charity & Social Impact">Charity & Social Impact</SelectItem>
                  <SelectItem value="Community & Inclusion">Community & Inclusion</SelectItem>
                  <SelectItem value="Faculty & Constituent">Faculty & Constituent</SelectItem>
                  <SelectItem value="Fitness & Recreation">Fitness & Recreation</SelectItem>
                  <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                  <SelectItem value="Games & Animation">Games & Animation</SelectItem>
                  <SelectItem value="Hobby & Special Interest">Hobby & Special Interest</SelectItem>
                  <SelectItem value="International & Cultural">International & Cultural</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Political">Political</SelectItem>
                  <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="Professional & Networking">Professional & Networking</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Spirituality & Faith">Spirituality & Faith</SelectItem>
                  <SelectItem value="Sports and Fitness">Sports and Fitness</SelectItem>
                  <SelectItem value="Technology & Projects">Technology & Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        </div>
        <div className="ml-2">
          <div className="flex justify-between items-center mb-8 mt-4">
            <h1 className="text-3xl lg:text-4xl font-semibold w-min">
              Favourites
            </h1>
            <button
              onClick={handleDownloadCalendar}
              disabled={downloading || favourites.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <DownloadOutlinedIcon className="w-5 h-5" />
              {downloading ? 'Downloading...' : 'Download Calendar'}
            </button>
          </div>
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