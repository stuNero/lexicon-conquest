export default async function fetchJson<T>(url: string, options = {}): Promise<T> {
  let response = await fetch(url, options);
  if (!response.ok)
    throw new Error(await response.text());
  let data = await response.json();
  return data;
}