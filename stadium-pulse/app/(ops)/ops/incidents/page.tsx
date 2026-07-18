export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Incidents Board</h2>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 min-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Zone</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="py-8 text-center text-zinc-500">
                No active incidents.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
