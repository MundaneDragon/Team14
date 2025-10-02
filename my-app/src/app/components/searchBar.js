export default function SearchBar({placeholder, setSearch}) {
    return (
        <input className="border-1 h-10 border-gray-500 px-4 rounded-xl" placeholder={placeholder} onChange={(e) => setSearch(e.target.value)}/>
    )
}