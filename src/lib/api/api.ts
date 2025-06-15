// ./lib/api.ts
import { 
  RawExercise, 
  Routine, 
  RoutineForEdit,
  UserProfile,
  FullExercise,
  Post,
  UserStats,
  Comment
} from "./types";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');
  return { Authorization: `Bearer ${token}` };
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/users/me`, { headers });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchUserStats(userId: number): Promise<UserStats> {
  const headers = await getAuthHeaders();
  const [followers, following, posts, routines] = await Promise.all([
    fetch(`${API_URL}/api/followers/followers/count/${userId}`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/api/followers/following/count/${userId}`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/api/posts/user/${userId}`, { headers }).then(r => r.json()),
    fetch(`${API_URL}/api/routines/user/${userId}`, { headers }).then(r => r.json()),
  ]);
  return {
    publicaciones: posts.length,
    rutinas: routines.length,
    seguidores: followers.followers,
    seguidos: following.following,
  };
}

export async function fetchUserRoutines(userId: number): Promise<Routine[]> {
  const headers = await getAuthHeaders();
  const routinesRes = await fetch(`${API_URL}/api/routines/user/${userId}`, { headers });
  if (!routinesRes.ok) throw await routinesRes.json();
  const routines = await routinesRes.json();
  
  const enriched = await Promise.all(routines.map(async (r: any) => {
    const exs = await Promise.all(r.exercises.map(async (e: any) => {
      const exRes = await fetch(`${API_URL}/api/exercises/${e.id}`, { headers });
      if (!exRes.ok) throw await exRes.json();
      return exRes.json();
    }));
    return { ...r, exercises: exs };
  }));
  
  return enriched;
}

export async function fetchUserPosts(userId: number): Promise<Post[]> {
  const headers = await getAuthHeaders();
  const rawPosts: any[] = await fetch(`${API_URL}/api/posts/user/${userId}`, { headers }).then(r => r.json());
  
  const enriched = await Promise.all(rawPosts.map(async post => {
    if (post.routine?.exercises) {
      post.routine.exercises = await Promise.all(
        post.routine.exercises.map(async (ex: { id: string }) => {
          const r = await fetch(`${API_URL}/api/exercises/${ex.id}`, { headers });
          return r.json();
        })
      );
    }
    return post;
  }));

  return enriched;
}

export async function deleteRoutine(routineId: number): Promise<boolean> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/routines/${routineId}`, {
    method: 'DELETE', headers
  });
  if (!res.ok) throw await res.json();
  return true;
}

export async function fetchUserProfile(id: string | number): Promise<UserProfile> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${API_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await res.json();

  const data = await res.json();
  const profilePic = data.profilePic?.startsWith('http')
    ? data.profilePic
    : `${API_URL}${data.profilePic}`;

  return { ...data, profilePic };
}

export async function checkIfFollowing(userId: string | number): Promise<boolean> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${API_URL}/api/followers/is-following/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return false;

  const data = await res.json();
  return data.isFollowing;
}

export async function followUser(userId: string | number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${API_URL}/api/followers/follow/${userId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw await res.json();
}

export async function unfollowUser(userId: string | number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${API_URL}/api/followers/unfollow/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw await res.json();
}

export async function fetchCurrentUserId(): Promise<number> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.id;
}

export async function fetchSavedRoutines(): Promise<Routine[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/saved-routines`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  const raw = await res.json();

  const enriched = await Promise.all(
    raw.map(async (rutina: any) => {
      const ejercicios = await Promise.all(
        rutina.exercises.map(async (e: any) => {
          const r = await fetch(`${API_URL}/api/exercises/${e.exerciseId || e.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return await r.json();
        })
      );
      return { ...rutina, exercises: ejercicios };
    })
  );

  return enriched;
}

export async function fetchCurrentUserProfileBasic(): Promise<UserProfile> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  const res = await fetch(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw await res.json();

  const data = await res.json();
  return {
    id: data.id,
    username: data.username,
    name: data.name,
    profilePic: data.profilePic?.startsWith('http') ? data.profilePic : `${API_URL}${data.profilePic}`
  };
}

export async function fetchPostsByType(type: string): Promise<Post[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  const url = {
    Publicaciones: `${API_URL}/api/posts`,
    Gustados: `${API_URL}/api/interactions/liked`,
    Guardados: `${API_URL}/api/interactions/saved`,
    Comentados: `${API_URL}/api/posts/commented`,
  }[type];

  if (!url) throw new Error('Tipo de post inválido');

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  const rawPosts: Post[] = await res.json();

  const enriched = await Promise.all(
    rawPosts.map(async (post: Post) => {
      if (post.routine?.exercises) {
        post.routine.exercises = await Promise.all(
          post.routine.exercises.map(async (ex: { id: string }) => {
            const r = await fetch(`${API_URL}/api/exercises/${ex.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return await r.json();
          })
        );
      }
      return post;
    })
  );

  return enriched;
}
  

export async function fetchMyPostsWithExercises(userId: number): Promise<Post[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  const res = await fetch(`${API_URL}/api/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const rawPosts: Post[] = await res.json();

  const enriched = await Promise.all(
    rawPosts.map(async (post: Post) => {
      if (post.routine?.exercises) {
        post.routine.exercises = await Promise.all(
          post.routine.exercises.map(async (ex: { id: string }) => {
            const r = await fetch(`${API_URL}/api/exercises/${ex.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return await r.json();
          })
        );
      }
      return post;
    })
  );
  return enriched;
}

export async function fetchRoutinesByType(
  type: 'Rutinas' | 'Rutinas guardadas' | 'Mis rutinas',
  userId?: number
): Promise<{ routines: Routine[], savedIds?: number[] }> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  if (type === 'Mis rutinas') {
    if (!userId) throw new Error('Se requiere userId para Mis rutinas');
    const routines = await fetchUserRoutines(userId);
    return { routines };
  }

  const url = type === 'Rutinas'
    ? `${API_URL}/api/routines/feed/following`
    : `${API_URL}/api/saved-routines`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const raw = await res.json();

  const enriched = await Promise.all(
    raw.map(async (routine: Routine) => {
      routine.exercises = await Promise.all(
        (routine.exercises || []).map(async (ex: { id: string }) => {
          const r = await fetch(`${API_URL}/api/exercises/${ex.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return await r.json();
        })
      );
      return routine;
    })
  );

  return {
    routines: enriched,
    savedIds: type === 'Rutinas guardadas' ? raw.map((r: Routine) => r.id) : undefined
  };
}

export async function searchGlobalContent(query: string, type: string = '') {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw await res.json();
  
  const data = await res.json();
  console.log('🔍 searchGlobalContent response:', { query, type, data });
  return data;
}

export async function toggleLikePost(postId: number, liked: boolean): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  const method = liked ? 'DELETE' : 'POST';

  const res = await fetch(`${API_URL}/api/interactions/${postId}/like`, {
    method,
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
}

export async function toggleSavePost(postId: number, saved: boolean): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  const method = saved ? 'DELETE' : 'POST';

  const res = await fetch(`${API_URL}/api/interactions/${postId}/save`, {
    method,
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
}

export async function isPostLiked(postId: number): Promise<boolean> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/interactions/${postId}/like`, { headers });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.liked;
}

export async function isPostSaved(postId: number): Promise<boolean> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/interactions/${postId}/save`, { headers });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.saved;
}

export async function getPostLikesCount(postId: number): Promise<number> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/interactions/${postId}/likes/count`, { headers });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.likes;
}

export async function getPostSavesCount(postId: number): Promise<number> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/interactions/${postId}/saves/count`, { headers });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.saves;
}

export async function isRoutineSaved(routineId: number): Promise<boolean> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/saved-routines/${routineId}/saved`, { headers });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.saved;
}

export async function toggleSaveRoutine(routineId: number, saved: boolean): Promise<void> {
  const headers = await getAuthHeaders();
  const method = saved ? 'DELETE' : 'POST';
  const res = await fetch(`${API_URL}/api/saved-routines/${routineId}`, { method, headers });
  if (!res.ok) throw await res.json();
}

export async function fetchComments(postId: number): Promise<Comment[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments/post/${postId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchReplies(commentId: number): Promise<Comment[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments/${commentId}/replies`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function postComment(
  postId: number,
  content: string,
  parentId?: number
): Promise<Comment> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postId, content, parentId })
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.comment;
}

export async function deleteComment(commentId: number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
}

export async function likeComment(commentId: number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments/${commentId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
}

export async function unlikeComment(commentId: number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments/${commentId}/like`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
}

export async function fetchCommentLikesCount(commentId: number): Promise<number> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments/${commentId}/likes/count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.count;
}

export async function checkCommentLiked(commentId: number): Promise<boolean> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  const res = await fetch(`${API_URL}/api/comments/${commentId}/like`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.liked;
}

export async function fetchCommentRepliesCount(commentId: number): Promise<number> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token no encontrado')
  const res = await fetch(`${API_URL}/api/comments/${commentId}/replies/count`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw await res.json()
  const data = await res.json()
  return data.count
}

