import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getEvent, registerToEvent, unregisterFromEvent } from "../api/events";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { isAdmin } from "../auth/auth";

function fmt(dt: string) {
  if (!dt) return "-";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString();
}

export function EventDetail() {
  const { id } = useParams();
  const eventId = id!;
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
  });

  const reg = useMutation({
    mutationFn: () => registerToEvent(eventId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });

  const unreg = useMutation({
    mutationFn: () => unregisterFromEvent(eventId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });

  if (isLoading) return <div className="text-sm text-slate-600">Loading...</div>;

  if (isError || !data) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <div className="font-semibold text-slate-900">Couldn’t load event</div>
        <button onClick={() => refetch()} className="mt-4 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl border bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
            <div className="mt-2 text-sm text-slate-600">
                {fmt(data.eventDate)} • Registered: {data.registeredCount}/{data.capacity}
            </div>
          </div>

          {isAdmin() && (
            <Link
              to={`/admin/events/${data.id}`}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Manage
            </Link>
          )}
        </div>

        {data.description && (
          <p className="mt-4 text-slate-700 leading-relaxed">{data.description}</p>
        )}

        <div className="mt-6 flex gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Capacity: {data.capacity}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">ID: {data.id.slice(0, 8)}…</span>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="font-semibold text-slate-900">Actions</div>
        <div className="text-sm text-slate-600 mt-1">Register/unregister for this event.</div>

        <ProtectedRoute>
          <div className="mt-4 grid gap-2">
            <button
              onClick={() => reg.mutate()}
              disabled={reg.isPending}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {reg.isPending ? "Registering..." : "Register"}
            </button>
            <button
              onClick={() => unreg.mutate()}
              disabled={unreg.isPending}
              className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
            >
              {unreg.isPending ? "Unregistering..." : "Unregister"}
            </button>
          </div>
        </ProtectedRoute>

        <div className="mt-6 text-xs text-slate-500">
          If you get 401/403, check roles and token.
        </div>
      </div>
    </div>
  );
}