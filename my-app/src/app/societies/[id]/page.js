"use client"
import MainBody from '@/app/components/mainBody'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function Society() {
  const [societyData, setSocietyData] = useState({
    
  })
  const params = useParams()
  
  useEffect(() => {
    // Fetch society 

  }, [])

  return (
  <MainBody>
    {params.id}
  </MainBody>)
}