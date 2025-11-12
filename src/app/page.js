import Link from "next/link";
import { GiMuscleUp } from "react-icons/gi";

export default function Home() {
  return (
    <div className="min-h-screen bg-red-900">
      <nav className="bg-red-950 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GiMuscleUp className="text-3xl text-red-100" />
            <span className="text-2xl font-bold text-red-100">BicepPump</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-red-200 hover:text-red-100 font-medium">
              Login
            </Link>
            <Link href="/signup" className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center" style={{height: 'calc(100vh - 80px)'}}>
        <div className="text-center">
          <h1 className="text-8xl font-black text-red-100 mb-4 tracking-wider">
            BICEP PUMP
          </h1>
          <p className="text-2xl text-red-200 font-bold">
            Unleash Your Strength
          </p>
        </div>
      </div>
    </div>
  );
}