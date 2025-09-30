"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import MainBody from "../components/mainBody";
import SocietyCard from "../components/societyCard";

const example = [
	{
		id: 32321,
		name: "180 Degrees Accounting",
		image: "/societylogo.webp",
	}, {
		id: 329823,
		name: "180 Degrees ",
		image: "/societylogo.webp",
	}, {
		id: 2309322,
		name: "180 Accounting",
		image: "/societylogo.webp",
	}, 
]

const fav = [32321, 2309322, 219839321, 29183]

export default function Societies({}) {
  const [favsocieties, setFavsocieties] = useState([])
  const [allSocieties, setAllSocieties] = useState([])
	const [favourites, setFavourites] = useState([])

	useEffect(() => {
		const res = example
		setAllSocieties(res)
		setFavourites(fav)
		for (const data of res) {
			if (fav.includes(data.id)) {
				setFavsocieties((prev) => [...prev, data])
			}
		}
	}, [])

  return (
    <MainBody>
        <div>
          <div className="flex justify-between items-center border-gray-700 border-b-1 pb-4">
            <div className="flex gap-2">
              <div className="border border-gray-700 py-2 pl-4 pr-2 rounded-full cursor-pointer hover:bg-gray-800 transition-all duration-200">
                Categories <KeyboardArrowDownOutlinedIcon/>
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
            Favourites
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favsocieties.map((data, index) => {
              return <SocietyCard key={index} data={data} favourites={favourites}/>
            })}
          </div>
          {favsocieties.length === 0 && 
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
            {allSocieties.map((data, index) => {
              return <SocietyCard key={index} data={data} favourites={favourites}/>
            })}
          </div>
          {allSocieties.length === 0 && 
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