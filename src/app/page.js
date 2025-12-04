import Link from "next/link";
import { GiMuscleUp } from "react-icons/gi";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
      <nav className="bg-red-950/90 backdrop-blur-sm px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <GiMuscleUp className="text-4xl text-red-100" />
            <span className="text-3xl font-black text-red-100 tracking-wide">💪 BicepPump</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-red-200 hover:text-red-100 font-semibold transition">
              Login
            </Link>
            <Link href="/signup" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 font-semibold transition shadow-lg">
              Join Now
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-black text-red-100 mb-6 tracking-wider">
              TRANSFORM
              <br />
              <span className="text-red-300">YOUR BODY</span>
            </h1>
            <p className="text-xl md:text-2xl text-red-200 font-bold mb-8 max-w-3xl mx-auto">
              Join the ultimate fitness community. Track workouts, monitor progress, and achieve your dream physique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-500 font-bold text-lg transition shadow-xl">
                🚀 Start Your Journey
              </Link>
              <Link href="/login" className="border-2 border-red-300 text-red-100 px-8 py-4 rounded-lg hover:bg-red-300 hover:text-red-900 font-bold text-lg transition">
                🔑 Member Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-red-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center text-red-100 mb-16">
            ✨ Why Choose BicepPump?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-red-900/50 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-4 font-bold text-red-300">WORKOUT</div>
              <h3 className="text-2xl font-bold text-red-100 mb-4">Smart Workouts</h3>
              <p className="text-red-200">Personalized workout plans tailored to your fitness level and goals. Track every rep, set, and achievement.</p>
            </div>
            
            <div className="text-center p-8 bg-red-900/50 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-4 font-bold text-red-300">TRACK</div>
              <h3 className="text-2xl font-bold text-red-100 mb-4">Progress Tracking</h3>
              <p className="text-red-200">Visualize your transformation with detailed analytics, body measurements, and strength progression charts.</p>
            </div>
            
            <div className="text-center p-8 bg-red-900/50 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-4 font-bold text-red-300">ACHIEVE</div>
              <h3 className="text-2xl font-bold text-red-100 mb-4">Achievements</h3>
              <p className="text-red-200">Unlock badges, maintain streaks, and celebrate milestones. Stay motivated with our gamified fitness experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-red-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-red-100">10K+</div>
              <div className="text-red-300 font-semibold">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-black text-red-100">50K+</div>
              <div className="text-red-300 font-semibold">Workouts Logged</div>
            </div>
            <div>
              <div className="text-4xl font-black text-red-100">95%</div>
              <div className="text-red-300 font-semibold">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-red-100">24/7</div>
              <div className="text-red-300 font-semibold">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black text-red-100 mb-6">
            Ready to Get Pumped? 💪
          </h2>
          <p className="text-xl text-red-200 mb-8">
            Join thousands of fitness enthusiasts who are already transforming their lives with BicepPump.
          </p>
          <Link href="/signup" className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white px-12 py-4 rounded-xl hover:from-red-500 hover:to-red-400 font-bold text-xl transition shadow-2xl">
            🎆 Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-950 py-8 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GiMuscleUp className="text-2xl text-red-300" />
            <span className="text-xl font-bold text-red-100">BicepPump</span>
          </div>
          <p className="text-red-300">
            © 2024 BicepPump. Pump up your fitness journey.
          </p>
        </div>
      </footer>
    </div>
  );
}