"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MainBody from '@/app/components/mainBody';
export default function LiveNetwork() {
  const params = useParams()

  return (
    <MainBody>
        LiveNetwork stuff 
    </MainBody>
  )
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
