import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getEvents } from "../api/events";

function fmt(dt: string) {
  if (!dt) return "-";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString();
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="h-5 w-2/3 bg-slate-100 rounded mb-2" />
      <div className="h-4 w-1/2 bg-slate-100 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-slate-100 rounded" />
        <div className="h-6 w-24 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export function EventsList() {
  const [q, setQ] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

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
          <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
          <p className="text-sm text-slate-600">Browse upcoming events and manage registrations.</p>
        </div>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title..."
            className="w-full sm:w-72 rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          />
          <button
            onClick={() => refetch()}
            className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border bg-white p-6">
          <div className="font-semibold text-slate-900">Couldn’t load events</div>
          <div className="text-sm text-slate-600 mt-1">Check API / CORS / auth and try again.</div>
          <button onClick={() => refetch()} className="mt-4 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <div className="text-lg font-semibold">No events found</div>
          <div className="text-sm text-slate-600 mt-1">Try a different search.</div>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Link
              key={e.id}
              to={`/events/${e.id}`}
              className="group rounded-2xl border bg-white p-4 hover:border-slate-300 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 group-hover:underline">{e.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{fmt(e.eventDate)}</div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-100 grid place-items-center text-slate-700 text-sm font-semibold">
                  {String(e.capacity ?? 0)}
                </div>
              </div>

              <div className="mt-4 flex gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Capacity</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Details</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}