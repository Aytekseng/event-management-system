import { http } from "./http";

export type EventDto = {
  id: string;
  title: string;
  eventDate: string;      // ✅ backend: EventDate
  capacity: number;
  location: string;       // ✅ backend: Location
  description: string;
};

export type EventDetailDto = EventDto & {
  registeredCount: number;
};

export type CreateUpdateEventRequest = {
  title: string;
  capacity: number;
  eventDate: string;      // ISO string
  location: string;
  description: string;
};

export async function getEvents(): Promise<EventDto[]> {
  const { data } = await http.get("/api/events");
  return data;
}

export async function getEvent(id: string): Promise<EventDetailDto> {
  const { data } = await http.get(`/api/events/${id}`);
  return data;
}

export async function registerToEvent(eventId: string) {
  await http.post(`/api/events/${eventId}/register`);
}

export async function unregisterFromEvent(eventId: string) {
  await http.delete(`/api/events/${eventId}/unregister`);
}

// ADMIN
export async function adminCreateEvent(payload: CreateUpdateEventRequest) {
  const { data } = await http.post(`/api/admin/events`, payload);
  return data; // { id }
}

export async function adminUpdateEvent(id: string, payload: CreateUpdateEventRequest) {
  await http.put(`/api/admin/events/${id}`, payload);
}

export async function adminDeleteEvent(id: string) {
  await http.delete(`/api/admin/events/${id}`);
}

// Participants endpoint’i backend’e ekleyeceğiz (aşağıda)
export type ParticipantDto = {
  id: string;
  displayName: string;
  email: string;
};

export async function adminGetParticipants(eventId: string): Promise<ParticipantDto[]> {
  const { data } = await http.get(`/api/admin/events/${eventId}/participants`);
  return data;
}