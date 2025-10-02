"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MainBody from '@/app/components/mainBody';
import { useAuth } from '@/contexts/AuthContext';

import { fetchEventUsers } from '@/lib/fetch';


export default function LiveNetwork() {
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("")
  const [users, setUsers] = useState([]);
  const [arrived, setArrived] = useState(false);
  const { id } = useParams();


  useEffect(() => {
    const handleFetch = async () => {
      try {
        const eventUsers = await fetchEventUsers(id);
        console.log(eventUsers);
        setUsers(eventUsers);
      } catch (err) {
        console.error(err.message);
      }
    };

    handleFetch();

    if (user) {
      setUserName(user.user_metadata?.username || user.email)
    }
    console.log(user)
  }, [loading])

  return (
    <MainBody>
      <div className='w-full flex justify-center pb-4'>
        <p className='text-xl drop-shadow-xl'>
          Find the people in your group!
        </p>
      </div>
      <div className='relative h-full flex w-full items-center flex-col font-semibold'>
        {users.map((value, index) => {
          return <BlackCircle key={index} data={value} arrived={arrived} setArrived={setArrived} />
        })}
      </div>
    </MainBody>
  )
}

function People({pos, name}) {
  return (
    <div className={`${pos} flex flex-col items-center absolute `}>
      <div className='w-24 h-24  rounded-full bg-gray-400'>
      </div>
      <div>
        {name}
      </div>
    </div>
  )
}

const BlackCircle = ({ minSize = 100, maxSize = 200, data, arrived, setArrived }) => {
  const { username, avatar } = data;
  const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  const x = Math.floor(Math.random() * (window.innerWidth - size));
  const y = Math.floor(Math.random() * (window.innerHeight - size));

  const haloSize = size * 1.5;
  const haloOffset = (haloSize - size) / 2;

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
        Username
      </h1>
      <div
        className="bg-[#282828] bg-cover bg-center border rounded-full absolute z-20 cursor-pointer"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${x}px`,
          top: `${y}px`,
          backgroundImage: avatar && `url(${avatar})`,
          animation: `pulseAvatar ${pulseDuration}s ${pulseDelay}s infinite ease-in-out`
        }}
        onClick={() => setArrived(prev => !prev)}
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

// function BlackCircle({ x,y,circleStyle}) {
//   return (
//     <div
//       className={`bg-gray-400/20 rounded-full absolute -z-5 ${circleStyle}`}
//     />
//   );
// }



// {events: [
//     {
//         id, startTime, endTime, location, title, hostedById, desc, network, societyName, category, eventImage
//     }
// ]

// users: [
//     {
//         id, email, password, favouriteSocietyIDs, iCalLink, joinedNetworksIDs
//     }
// ]

// societies: [
//     {
//         id, societyName, societyImage, societyUniversity, societyDesc, socialMedia, 
//     }
// ]}
