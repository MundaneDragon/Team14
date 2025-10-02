"use client";
import MainBody from "../components/mainBody"
import CloseIcon from '@mui/icons-material/Close';
import Link from "next/link";

import { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { networkAtom } from "@/app/atoms/networkAtom";
import { eventsAtom } from "@/app/atoms/eventsAtom";
import { deleteNetwork, fetchEvents, fetchNetwork, fetchEventNetwork, updateHint, fetchNetworkHints} from '@/lib/fetch';

const AddHintModal = ({ eventId, onClose }) => {
  const [hint, setHint] = useState("");

  const handleSave = () => {
    updateHint(eventId, hint);
    setHint("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      <div
        className="relative bg-gray-900 rounded-xl p-6 w-full max-w-md z-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="hint" className="text-white font-medium">
            Your hint (max. 50 chars)
          </label>
          <input
            id="hint"
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Wearing a red hoodie"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            maxLength={50}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
            disabled={!hint.trim()}
          >
            Save Hint
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewHintsModal = ({ eventId, onClose }) => {
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHints = async () => {
      setLoading(true)
      try {
        const data = await fetchNetworkHints(eventId)
        setHints(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    };

    loadHints();
  }, [eventId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div
        className="relative bg-gray-900 rounded-xl p-6 w-full max-w-md z-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Find these people!</h2>

        {loading ? (
          <p className="text-white/70">Loading...</p>
        ) : hints.length === 0 ? (
          <p className="text-white/70">No hints available yet.</p>
        ) : (
          <ul className="flex flex-col gap-3 max-h-64 overflow-y-auto">
            {hints.map(( { hint }, index) => (
              <li
                key={index}
                className="bg-gray-800 text-white p-2 rounded-md break-words"
              >
                {hint}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

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
    const [loggedIn, setLoggedIn] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    useEffect(() => {
        const handleFetch = async () => {
            try {
                setLoading(true)
                const { user, fetchedNetwork } = await fetchNetwork();
                setLoggedIn(!!user)

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
                setLoggedIn(false)
            } finally {
                setLoading(false)
            }
        };

        handleFetch();
    }, []);

    console.log(networkingEvents);


    return (
        <MainBody>
            {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <NetworkCardSkeleton key={index}/>
                )) 
            : (loggedIn 
            ? <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold py-2 ml-7">
                    Planned Networking Events
                </h1>
                <div className="flex flex-col w-full items-center gap-2">
                    {networkingEvents.map((value, index) => {
                        return <NetworkCard data={value} key={index} setNetwork={setNetwork} userNetwork={network} setNetworkingEvents={setNetworkingEvents} setSelectedEvent={setSelectedEvent}/>
                    })}
                </div>
            </div>
            : <div className="flex flex-col items-center justify-center w-full py-10 px-6 bg-[#101727]/50  rounded-2xl shadow-md text-center gap-4">
                <h2 className="text-3xl font-semibold text-white">
                    Sign in to continue
                </h2>
                <p className="text-gray-500 text-lg max-w-md">
                    Log in to start automating your networking!
                </p>
            </div>

            )}
            {loggedIn && selectedEvent && !selectedEvent?.viewHints && (
                <AddHintModal
                    eventId={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}

            {loggedIn && selectedEvent?.viewHints && (
            <ViewHintsModal
                eventId={selectedEvent.id}
                onClose={() => setSelectedEvent(null)}
            />
            )}
        </MainBody>
    )
}



function NetworkCard({data, setNetwork, userNetwork, setNetworkingEvents, setSelectedEvent}) {
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
            ><img src={data.image} alt="Image of the event" className="sr-only" /></div>
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
            <div className="flex flex-row gap-2">
                <button
                className="bg-[#A3CBFF] w-32 rounded-full text-black py-2 cursor-pointer hover:bg-[#5a7ca0] flex justify-center items-center gap-2 transition-all duration-300 ease-in-out"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedEvent(id);
                }}
                >
                + Add Hint
                </button>
                <button
                className="bg-[#FFFFFF] w-32 rounded-full text-black py-2 cursor-pointer hover:bg-gray-300 flex justify-center items-center gap-2 transition-all duration-300 ease-in-out"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedEvent({ id, viewHints: true })}
                    }
                >
                View Hints
                </button>
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
        </div>
    </Link>
    )
}