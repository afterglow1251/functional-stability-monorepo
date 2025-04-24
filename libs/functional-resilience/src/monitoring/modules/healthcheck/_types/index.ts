export type ConnectionResult =
  | { ok: true; error: null }
  | { ok: false; error: Error };
