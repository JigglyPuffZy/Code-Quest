export type CoopRoom = {
  id: string; join_code: string; creator_id: string; partner_id: string | null;
  driver_id: string; mission_id: string; code: string; version: number; round: number;
  last_review: string; updated_at: string; expires_at: string;
};
export function coopRole(room: CoopRoom, userId: string): "driver" | "reviewer" | "outside" {
  if (room.creator_id !== userId && room.partner_id !== userId) return "outside";
  return room.driver_id === userId ? "driver" : "reviewer";
}
export function coopError(message: string) {
  if (/schema cache|does not exist|could not find.*function|lab_coop_rooms/i.test(message)) return "Co-op database setup is missing. Follow the database setup instructions in supabase/README.md.";
  return message;
}
