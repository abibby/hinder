export function useUserID(): string {
  let id = localStorage.getItem("user_id");
  if (id === null) {
    id = crypto.randomUUID();
    localStorage.setItem("user_id", id);
  }
  return id;
}
