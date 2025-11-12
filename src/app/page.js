import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-black px-6 py-4 border-b-2 border-red-800">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black text-red-600">BicepPump</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-red-500 hover:text-red-400 font-bold">
              Login
            </Link>
            <Link href="/signup" className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center h-96">
        <h2 className="text-6xl font-black text-red-600">BicepPump</h2>
      </div>
    </div>
  );
}
