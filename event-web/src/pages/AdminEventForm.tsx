import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  adminCreateEvent,
  adminDeleteEvent,
  adminGetParticipants,
  adminUpdateEvent,
  getEvent,
  type CreateUpdateEventRequest,
} from "../api/events";

type FormState = {
  title: string;
  description: string;
  location: string;
  eventDateLocal: string; // datetime-local
  capacity: number;
};

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function AdminEventForm() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const eventId = id ?? "";

  const nav = useNavigate();
  const qc = useQueryClient();

  const [errorMsg, setErrorMsg] = useState("");

  const { data: existing } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
    enabled: !isNew,
  });

  const { data: participants } = useQuery({
    queryKey: ["participants", eventId],
    queryFn: () => adminGetParticipants(eventId),
    enabled: !isNew,
  });

  const initial = useMemo<FormState>(() => {
    if (!existing) {
      return {
        title: "",
        description: "",
        location: "",
        eventDateLocal: new Date().toISOString().slice(0, 16),
        capacity: 10,
      };
    }
    return {
      title: existing.title ?? "",
      description: existing.description ?? "",
      location: existing.location ?? "",
      eventDateLocal: toLocalInputValue(existing.eventDate),
      capacity: Number(existing.capacity ?? 0),
    };
  }, [existing]);

  const [form, setForm] = useState<FormState>(initial);

  // edit modunda existing gelince sync
  if (!isNew && existing && form.title !== initial.title) {
    setTimeout(() => setForm(initial), 0);
  }

  const save = useMutation({
    mutationFn: async () => {
      setErrorMsg("");

      const payload: CreateUpdateEventRequest = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        capacity: Number(form.capacity),
        eventDate: new Date(form.eventDateLocal).toISOString(), // ✅ backend EventDate
      };

      if (!payload.title) throw new Error("Title is required");
      if (!payload.location) throw new Error("Location is required");
      if (!payload.eventDate) throw new Error("EventDate is required");
      if (!payload.capacity || payload.capacity < 1) throw new Error("Capacity must be >= 1");

      if (isNew) return adminCreateEvent(payload);
      return adminUpdateEvent(eventId, payload);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["events"] });
      if (isNew) nav("/admin");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const s = err.response?.status;
        const d = err.response?.data;
        setErrorMsg(`HTTP ${s}: ${typeof d === "string" ? d : JSON.stringify(d)}`);
      } else {
        setErrorMsg(String(err));
      }
    },
  });

  const del = useMutation({
    mutationFn: () => adminDeleteEvent(eventId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["events"] });
      nav("/admin");
    },
    onError: (err) => setErrorMsg(String(err)),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{isNew ? "New Event" : "Manage Event"}</h1>

        {!isNew && (
          <button
            type="button"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
            onClick={() => del.mutate()}
            disabled={del.isPending}
          >
            {del.isPending ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600">Title</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Location</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Event Date</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.eventDateLocal}
              onChange={(e) => setForm({ ...form, eventDateLocal: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Capacity</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-600">Description</label>
          <textarea
            className="mt-1 w-full rounded-xl border px-3 py-2"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
          onClick={() => save.mutate()}
          disabled={save.isPending}
        >
          {save.isPending ? "Saving..." : "Save"}
        </button>

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}
      </div>

      {!isNew && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="font-semibold mb-3">Participants</div>

          <div className="space-y-2">
            {participants?.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <div className="font-medium">{p.displayName}</div>
                  <div className="text-xs text-slate-600">{p.email}</div>
                </div>
              </div>
            ))}
            {participants?.length === 0 && <div className="text-sm text-slate-600">No participants.</div>}
          </div>
        </div>
      )}
    </div>
  );
}