// app/feed/page.tsx

import FeedMenu from "@/components/FeedMenu"

export default function FeedPage() {
    return (
        <div className="flex min-h-screen bg-black text-white">
            <aside className="w-1/3 border-r border-gray-700 p-6">
                <FeedMenu />
            </aside>

            <section className="w-1/3 p-6 space-y-6 overflow-y-auto bg-[#27391C]">
                <div className="bg-gray-800 p-4 rounded">Post 1</div>
                <div className="bg-gray-800 p-4 rounded">Post 2</div>
                <div className="bg-gray-800 p-4 rounded">Post 3</div>
            </section>

            <aside className="w-1/3 border-l border-gray-700 p-6">
            
            </aside>
        </div>
    )
}
