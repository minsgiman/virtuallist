export async function fetchUsers(page, size) {
  let fetchResponse = await fetch(`/users?page=${page}&size=${size}`);
  let fetchJson = await fetchResponse.json();

  return fetchJson;
}
