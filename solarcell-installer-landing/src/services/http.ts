export async function httpGet<TResponse>(url: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while calling ${url}`);
  }

  return response.json() as Promise<TResponse>;
}
