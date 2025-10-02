import { TbLocationFilled } from "react-icons/tb";
import { ClockIcon } from "@radix-ui/react-icons"
import { IoMdPricetag } from "react-icons/io";
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import Link from "next/link";
export default function EventModal({eventData}) {
  console.log(eventData)
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    return `${date.toLocaleDateString(undefined, options)}, ${hours}:${minutes} ${ampm}`;
  }

  return (
    <div className="flex flex-col gap-6 max-h-[80vh]">
      <div className="flex items-start w-[90%] px-4 flex-col ">
        <h1 className="font-bold text-3xl">
          {eventData.title}
        </h1>
        <p className="flex gap-1">
          Hosted by 
          <Link className="underline hover:text-white/90" href={`/societies/${eventData.society_id}`}>
            {eventData.societies.name}
          </Link>
        </p>
      </div>
      <div className="flex flex-col w-full overflow-y-auto px-4">
        <div className="flex flex-col px-4 pt-4 pb-8 gap-8">
          <div className="flex flex-row gap-5 items-center">
            <TbLocationFilled style={{ width: "1.5rem", height: "1.5rem", opacity: "50%" }}/>
            {eventData.location}
          </div>
          <div className="flex flex-row gap-5 items-center">
            <ClockIcon style={{ width: "1.5rem", height: "1.5rem", opacity: "50%" }}/>
            {`${formatTimestamp(eventData.start_time)} - ${formatTimestamp(eventData.end_time)}`}
          </div>
          {eventData.price && (
            <div className="flex flex-row gap-5 items-center">
              <IoMdPricetag style={{ width: "1.5rem", height: "1.5rem", opacity: "50%" }}/>
              {eventData.price}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-xl">
            Details
          </h2>

          <p>{eventData.description}</p>
        </div>
      </div>
      <button className="w-full bg-[#A3CBFF] flex items-center justify-center py-2 rounded-full cursor-pointer gap-1 hover:bg-[#99bae4] shadow-xl text-black"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        Want to Network <LanOutlinedIcon fontSize="small"/>
      </button>
    </div>
  )
}