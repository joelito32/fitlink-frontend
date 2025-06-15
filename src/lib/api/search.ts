// src/lib/api/search.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchContent(query: string, type: string, token: string, signal?: AbortSignal) {
    const typeParam = type ? `&type=${type}` : '';
    const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}${typeParam}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal
    });
    if (!res.ok) throw new Error('Error al buscar');
    return res.json();
}
