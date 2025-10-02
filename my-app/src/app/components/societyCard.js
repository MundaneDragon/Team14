import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons"
import Link from 'next/link';
import { updateFavourites } from "@/lib/fetch";

export default function SocietyCard({data, favourites, setFavourites}) {

    const clickSociety = () => {
        console.log("Clicking on ", data.name)
    }

    console.log(data.image);
    return (
    <Link className="w-full hover:scale-105 transition-all cursor-pointer duration-300 flex flex-col gap-4 items-center p-2 rounded-xl"
    onClick={clickSociety}
    href={`/societies/${data.id}`}
    >
        <div className={`w-40 h-40 bg-gray-500 rounded-full bg-cover bg-center flex items-end justify-end relative `}
          style={{ backgroundImage: `url(${data.image})` }}
        >
            {!data.image && (
                <div className="absolute right-[25%] bottom-[25%] flex flex-col w-[50%] h-[50%] text-black text-2xl font-bold items-center justify-center">
                    <span>NO</span>
                    <span>IMAGE</span>
                </div>
            )}
            <div className="transition-all duration-300 ease-in-out h-12 w-12 rounded-full bg-[#101727] flex items-center justify-center cursor-pointer hover:scale-105"
            onClick={
                (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                
                    let newFavourites;

                    if (favourites?.includes(data.id)) {
                        newFavourites = favourites?.filter((fav => fav !== data.id));
                    } else {
                        if (favourites) { 
                            newFavourites = [...favourites, data.id];
                        } else {
                            newFavourites = [data.id];
                        }
                    }

                    setFavourites(newFavourites);
                    updateFavourites(newFavourites);
                }
            }
            >
                {favourites?.includes(data.id) ? (
                    <StarFilledIcon className="w-6 h-6 text-[#FFDFA3]"/>
                ) : (
                    <StarIcon className="w-6 h-6 text-[#FFFFFF]"/>
                )}
            </div>
        </div>
        <div className="text-sm font-semibold">
            {data.name}
        </div>
    </Link>
    )
}