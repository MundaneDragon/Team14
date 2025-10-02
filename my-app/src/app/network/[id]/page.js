"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MainBody from '@/app/components/mainBody';
import { useAuth } from '@/contexts/AuthContext';
import { useRef } from 'react';

import { fetchEventUsers, getOrCreateUserGroup, toggleArrival } from '@/lib/fetch';

const circles = [];

function generatePosition(size, containerWidth, containerHeight) {
  let tries = 0;
  while (tries < 100) {
    const x = Math.random() * (containerWidth - size);
    const y = Math.random() * (containerHeight - size);

    const overlapping = circles.some(c => {
      const dx = c.x - x;
      const dy = c.y - y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      return distance < (c.size + size) / 2 + 10;
    });

    if (!overlapping) {
      circles.push({ x, y, size });
      return { x, y };
    }

    tries++;
  }

  const x = Math.random() * (containerWidth - size);
  const y = Math.random() * (containerHeight - size);
  circles.push({ x, y, size });
  return { x, y };
}

export default function LiveNetwork() {
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("")
  const [users, setUsers] = useState([]);
  const [arrived, setArrived] = useState(false);
  const { id } = useParams();


  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data, username } = await getOrCreateUserGroup(id);
        setUsers(data);
        setUserName(username);
        console.log(data, username)
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchGroup();
  }, [loading])

  return (
    <MainBody>
      <div className='w-full flex justify-center pb-4'>
        <p className='text-xl drop-shadow-xl'>
          Find the people in your group!
        </p>
      </div>
      <div className='relative h-full flex w-full items-center flex-col font-semibold' id="circleContainer">
        {users.map((value, index) => {
          const container = document.getElementById('circleContainer');
          const { width, height } = container.getBoundingClientRect();
          return <BlackCircle key={index} data={value} arrived={arrived} setArrived={setArrived} userName={userName} containerWidth={width} containerHeight={height} />
        })}
      </div>
    </MainBody>
  )
}

const BlackCircle = ({ minSize = 100, maxSize = 200, data, arrived, setArrived, userName, containerWidth, containerHeight }) => {
  const { profiles } = data;
  const sizeRef = useRef(null);
  if (!sizeRef.current) {
    const minSize = 100;
    const maxSize = 200;
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    const haloSize = size * 1.5;
    sizeRef.current = { size, haloSize };
  }
  const { size, haloSize } = sizeRef.current;
  // const x = Math.floor(Math.random() * (window.innerWidth - size));
  // const y = Math.floor(Math.random() * (window.innerHeight - size));

  const haloOffset = (haloSize - size) / 2;
  const position = useRef(generatePosition(haloSize, containerWidth, containerHeight));
  const { x, y } = position.current;

  const pulseDuration = 1.5 + Math.random() * 1.5;
  const pulseDelay = Math.random() * 1.5;

  return (
    <>
      <h1 
        className='absolute text-white font-bold flex justify-center items-start drop-shadow-lg'
        style={{
          fontSize: `${size / 8}px`,
          width: `${size}px`,
          height: `${size}px`,
          left: `${x}px`,
          top: `${y - (size / 4)}px`,
          animation: `pulseAvatar ${pulseDuration}s ${pulseDelay}s infinite ease-in-out`
        }}
      >
        {userName}
      </h1>
      <div
        className="bg-[#282828] bg-cover bg-center border rounded-full absolute z-20 cursor-pointer"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${x}px`,
          top: `${y}px`,
          backgroundImage: profiles.avatar && `url(${profiles.avatar})`,
          animation: `pulseAvatar ${pulseDuration}s ${pulseDelay}s infinite ease-in-out`
        }}
        onClick={() => {setArrived(prev => !prev); toggleArrival();}}
      />
      <div
        className="bg-white opacity-20 rounded-full absolute z-10"
        style={{
          backgroundColor: arrived ? "#B8FFC1": "#FFFFFF",
          width: `${haloSize}px`,
          height: `${haloSize}px`,
          left: `${x - haloOffset}px`,
          top: `${y - haloOffset}px`,
          animation: `pulseAvatar ${pulseDuration}s ${pulseDelay}s infinite ease-in-out, pulseHalo ${pulseDuration}s ${pulseDelay}s infinite ease-in-out`
        }}
      />
      <style jsx>{`
        @keyframes pulseHalo {
          0% { opacity: 0; }
          50% { opacity: 0.2; }
          100% { opacity: 0; }
        }

        @keyframes pulseAvatar {
          0% { transform: scale(0.95); }
          50% { transform: scale(1); }
          100% { transform: scale(0.95); }
        }
      `}</style>
    </>
  );
}