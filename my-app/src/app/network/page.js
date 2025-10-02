"use client";
import MainBody from "../components/mainBody"
import CloseIcon from '@mui/icons-material/Close';
import Link from "next/link";

import { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { networkAtom } from "@/app/atoms/networkAtom";
import { eventsAtom } from "@/app/atoms/eventsAtom";
import { deleteNetwork, fetchEvents, fetchNetwork, fetchEventNetwork } from '@/lib/fetch';

const NetworkCardSkeleton = () => {
  return (
    <div className="flex flex-col w-[95%] md:flex-row gap-4 p-4 rounded-xl animate-pulse">
      <div className="flex gap-2 items-center">
        <div className="h-36 w-1 bg-gray-500 rounded-md" />
        <div className="w-80 h-40 bg-gray-400 rounded-xl" />
      </div>

      <div className="flex flex-col gap-2 flex-1 mt-2 md:mt-0">
        <div className="w-3/4 h-6 bg-gray-500 rounded-md" />
        <div className="w-1/2 h-6 bg-gray-500 rounded-md" />
        <div className="w-full h-4 bg-gray-500 rounded-md" />
        <div className="w-2/3 h-4 bg-gray-500 rounded-md" />
      </div>
    </div>
  )
}

export default function Network() {
    const [networkingEvents, setNetworkingEvents] = useState([]);
    const [network, setNetwork] = useAtom(networkAtom);
    const [events, setEvents] = useAtom(eventsAtom);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleFetch = async () => {
            try {
                setLoading(true)
                const fetchedNetwork = await fetchNetwork();
                console.log(fetchedNetwork);
                const fetchedEvents = await fetchEvents();

                setNetwork(fetchedNetwork);
                setEvents(fetchedEvents);

                const eventsWithNetwork = await Promise.all(
                    fetchedEvents
                    .filter(event => fetchedNetwork.map(e => e.event_id).includes(event.id))
                    .map(async (event) => {
                        const network = await fetchEventNetwork(event.id);
                        return { ...event, network };
                    })
                );

                setNetworkingEvents(eventsWithNetwork);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false)
            }
        };

        handleFetch();
    }, []);

    console.log(networkingEvents);


    return (
        <MainBody>
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold py-2 ml-7">
                    Planned Networking Events
                </h1>
                <div className="flex flex-col w-full items-center gap-2">
                    {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <NetworkCardSkeleton/>
                        )) 
                    : networkingEvents.map((value, index) => {
                        return <NetworkCard data={value} key={index} setNetwork={setNetwork} userNetwork={network} setNetworkingEvents={setNetworkingEvents} />
                    })}
                </div>
            </div>
        </MainBody>
    )
}



function NetworkCard({data, setNetwork, userNetwork, setNetworkingEvents}) {
    const { id, image, title, start_time, end_time, network } = data;
    
    const timeUntil = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diff = start - now;
        const diffEnded = end - now;
        const minutes = Math.floor(diff / (1000 * 60));
        const minutesEnded = Math.floor(diffEnded / (1000 * 60));
        if (minutes < 0 && minutesEnded >= 0) {
            return "#A3FFAE";
        } else if (minutes < 30 && minutesEnded >= 0) {
            return "#FFDCA3";
        } else {
            return "#FFA3A3"
        }
    }
    
    const formatTimeUntil = (startTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = start - now;

        if (diff <= 0) return "Already started";

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `Happening in ${minutes} min`;
        } else if (hours < 24) {
            return `Happening in ${hours} hr${hours > 1 ? "s" : ""}`;
        } else {
            return `Happening in ${days} day${days > 1 ? "s" : ""}`;
        }
    }

    console.log(data);

    return (
    <Link className="flex flex-col w-[95%] md:flex-row gap-4 p-4 hover:bg-gray-400/20 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300"
    href={`/network/${id}`}>
        <div className="flex gap-2 items-center">
            <div className="h-10/12 w-1 rounded-md" style={{ backgroundColor: timeUntil(start_time, end_time) }}>
            </div>
            <div className={`w-80 h-40 bg-gray-400 rounded-xl bg-cover bg-center flex items-end p-2 `}
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            {/* <img src={image} className="w-80 h-42 rounded-md"/> */}
        </div>
        <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-xl">
                {title}
            </h2>
            <div className="flex flex-col text-gray-400">
                <p>
                    {formatTimeUntil(start_time)}
                </p>
                <p>
                    {network.length === 1 ? (
                        <span>1 person planning to network</span>
                    ) : (
                        <span>{network.length} people planning to network</span>
                    )}
                </p>
            </div>
            <button className="bg-[#FFA3A3] w-64 rounded-full text-black py-2 cursor-pointer hover:bg-[#f58888] flex justify-center items-center gap-2 transition-all duration-300 ease-in-out"
            onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    const newNetwork = userNetwork.filter(event => event.event_id !== id);
            
                    setNetwork(newNetwork);
                    setNetworkingEvents(prev => prev.filter(event => event.id !== id));
                    deleteNetwork(id);
            }}>
                Remove 
                <div className="pt-0.5">
                    <CloseIcon/>
                </div>
            </button>
        </div>
    </Link>
    )
}