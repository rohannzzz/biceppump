import Link from "next/link";
import { GiMuscleUp } from "react-icons/gi";
export default function PublicNavbar() {
  return (
    <nav className="bg-red-950 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <GiMuscleUp className="text-3xl text-red-100" />
            <span className="text-2xl font-bold text-red-100">BicepPump</span>
          </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
            Login
          </Link>
          <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
