import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getEvents } from "../api/events";

function fmt(dt: string) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

export function AdminDashboard() {
  const [q, setQ] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const filtered = useMemo(() => {
    const list = data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((e) => (e.title ?? "").toLowerCase().includes(needle));
  }, [data, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin</h1>
          <p className="text-sm text-slate-600">Create, edit, delete events and view participants.</p>
        </div>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="w-full sm:w-72 rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          />
          <button onClick={() => refetch()} className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50">
            Refresh
          </button>
          <Link to="/admin/new" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
            New Event
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold text-slate-900">Events</div>
          <div className="text-xs text-slate-500">{filtered.length} item(s)</div>
        </div>

        {isLoading && <div className="p-4 text-sm text-slate-600">Loading...</div>}
        {isError && <div className="p-4 text-sm text-red-600">Failed to load</div>}

        {!isLoading && !isError && (
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Title</th>
                  <th className="text-left font-medium px-4 py-3">Start</th>
                  <th className="text-left font-medium px-4 py-3">Capacity</th>
                  <th className="text-right font-medium px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{e.title}</td>
                    <td className="px-4 py-3 text-slate-700">{fmt(e.eventDate)}</td>
                    <td className="px-4 py-3 text-slate-700">{e.capacity}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/events/${e.id}`}
                        className="inline-flex items-center rounded-lg border px-3 py-1.5 hover:bg-white"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-slate-600">
                      No results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}