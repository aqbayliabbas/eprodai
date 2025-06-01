export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm mb-4">
        Dashboard
      </h1>
      <p className="text-lg text-muted-foreground mb-8">Welcome to your dashboard! Here are your stats:</p>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">1,245</span>
          <span className="text-gray-500">Images Generated</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">312</span>
          <span className="text-gray-500">Active Users</span>
        </div>
      </div>
    </div>
  );
}
