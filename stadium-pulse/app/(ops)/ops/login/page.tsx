export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Staff Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Passcode</label>
            <input 
              type="password" 
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md p-2 bg-transparent"
              placeholder="Enter ops passcode"
            />
          </div>
          <button 
            type="button" 
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
