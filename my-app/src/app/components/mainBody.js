export default function MainBody({children}) {
    return (
        <div className="min-h-screen w-full flex justify-center pt-24 pb-12 px-4">
            <div className="w-5xl flex flex-col">
                {children}
            </div> 
        </div>
    )
}