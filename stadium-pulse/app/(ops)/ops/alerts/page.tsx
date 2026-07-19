export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Alert Log</h2>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 min-h-[500px]">
        <p className="text-zinc-500">
          No active alerts. The alert feed with acknowledgement workflow will appear here when incidents are detected.
        </p>
      </div>
    </div>
  );
}
