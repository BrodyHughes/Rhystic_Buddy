// https://api.scryfall.com

export async function fetchItems() {
  try {
    const res = await fetch('https://api.scryfall.com/cards/search?q=e%3Aeld&unique=prints', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    console.log('items →', data);
    return data;
  } catch (err) {
    console.error('fetchItems failed:', err);
  }
}

fetchItems();
