import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
export default function SocietyCard({data, favourites}) {

    const clickSociety = () => {
        console.log("Clicking on ", data.name)
    }
    return (
    <Link className="w-full hover:scale-105 transition-all cursor-pointer group duration-300 hover:bg-gray-400/20 flex flex-col gap-4 items-center p-2 rounded-xl"
    onClick={clickSociety}
    href={`/societies/${data.id}`}
    >
        <div className={`w-full h-40 bg-gray-400 rounded-full bg-cover bg-center flex items-end justify-end `}
          style={{ backgroundImage: `url(${data.image})` }}
        >
            <div className="h-12 w-12 rounded-full bg-[#101727] flex items-center justify-center cursor-pointer hover:scale-105"
            onClick={
                (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
            >
                <StarIcon  fontSize="large" sx={{ color: favourites.includes(data.id) ? "#FFDFA3" : "white",
                    "&:hover": {
                        color: favourites.includes(data.id) ? "white" : "#FFDFA3"
                    },
                 }}
                />
            </div>
        </div>
        <div className="text-sm font-semibold">
            {data.name}
        </div>
    </Link>)
}