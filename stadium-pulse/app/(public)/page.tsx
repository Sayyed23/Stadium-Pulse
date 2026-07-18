import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">StadiumPulse AI</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          GenAI-Enabled Stadium Operations & Tournament Experience Platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/assistant" 
            className="rounded-full bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            I'm a Fan
          </Link>
          <Link 
            href="/ops/login" 
            className="rounded-full border border-zinc-300 dark:border-zinc-700 px-8 py-3 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            I'm Staff
          </Link>
        </div>
      </div>
    </main>
  );
}
