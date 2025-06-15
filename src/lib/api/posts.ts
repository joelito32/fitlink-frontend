const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => localStorage.getItem('token');

export async function fetchAllPosts() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchLikedPosts() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/interactions/liked`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchSavedPosts() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/interactions/saved`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchCommentedPosts() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/posts/commented`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchUserPosts(userId: number) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
