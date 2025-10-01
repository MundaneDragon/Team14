"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MainBody from '@/app/components/mainBody';
import { useAuth } from '@/contexts/AuthContext';


export default function LiveNetwork() {
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("")
  const params = useParams()

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata?.username || user.email)
    }
    console.log(user)
  }, [loading])

  return (
    <MainBody>
      <div className='w-full flex justify-center pb-2'>
        <p className='text-xl'>
          Find the people in your group!
        </p>
      </div>
      <div className='relative h-full flex w-full items-center flex-col font-semibold'>
        <div className='absolute flex items-center justify-center bottom-1/3 bg-gray-400/50 h-96 w-96 rounded-full '>
          <p className='w-64 h-64 bg-gray-400 rounded-full flex items-center justify-center text-xl'>
            {userName}
          </p>
        </div>
        <People pos="right-1/10" name="John" />
        <People pos="bottom-1/10" name="Smith" />
        <People pos="left-1/10" name="James"/>
      </div>
      <BlackCircle circleStyle="h-32 w-32 right-200"/>
      <BlackCircle circleStyle="h-64 w-64"/>
      <BlackCircle circleStyle="h-96 w-96 bottom-10"/>
      <BlackCircle circleStyle="h-96 w-96 bottom-10 right-120"/>
      <BlackCircle circleStyle="h-64 w-64 bottom-50 right-200"/>
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

function BlackCircle({ x,y,circleStyle}) {
  return (
    <div
      className={`bg-gray-400/20 rounded-full absolute -z-5 ${circleStyle}`}
    />
  );
}



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
