const HEADERS = {
  'User-Agent': 'CommanderCounter/1.0',
  Accept: 'application/json',
};

export async function apiFetch<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
