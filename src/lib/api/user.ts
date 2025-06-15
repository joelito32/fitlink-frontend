// lib/api/user.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => localStorage.getItem('token');

export async function getMe() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function getUserById(id: string | number) {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function isFollowingUser(id: number) {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(`${API_URL}/api/followers/is-following/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.isFollowing;
}

export async function followUser(id: number) {
  const token = getToken();
  if (!token) return;
  await fetch(`${API_URL}/api/followers/follow/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function unfollowUser(id: number) {
  const token = getToken();
  if (!token) return;
  await fetch(`${API_URL}/api/followers/unfollow/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
