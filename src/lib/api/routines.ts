// src/lib/api/routines.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => localStorage.getItem('token');

export async function fetchPublicFollowingRoutines() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/routines/following/public`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchUserRoutines() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/routines/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchSavedRoutines() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/saved-routines`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchExerciseById(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/exercises/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function deleteRoutine(id: number) {
  const token = getToken();
  return fetch(`${API_URL}/api/routines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function saveRoutine(id: number) {
  const token = getToken();
  return fetch(`${API_URL}/api/saved-routines/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function unsaveRoutine(id: number) {
  const token = getToken();
  return fetch(`${API_URL}/api/saved-routines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}
