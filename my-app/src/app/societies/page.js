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
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Name A-Z");
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