export interface UserProfile {
  id: number
  username: string
  name?: string
  birthdate?: string
  bio?: string
  email?: string
  profilePic?: string
}

export interface RawExercise {
  id: string
  name?: string
}

export interface FullExercise {
  id: string
  name: string
  target: string
  secondaryMuscles: string[]
  equipment: string
  bodyPart: string
  instructions: string
}

export interface Routine {
  id: number
  title: string
  description: string
  isPublic: boolean
  createdAt?: string
  updatedAt: string
  owner: {
    id: number
    username: string
  }
  exercises: RawExercise[] | FullExercise[]
}

export interface RoutineForEdit {
  id: number
  title: string
  description: string
  isPublic: boolean
  exercises: FullExercise[]
}

export interface Post {
  id: number
  author: {
    id: number
    username: string
    name?: string
    profilePic?: string
  }
  content: string
  createdAt: string
  likesCount: number
  commentsCount: number
  savedCount: number
  isLiked: boolean
  isSaved: boolean
  routine?: Routine
}

export interface UserStats {
  publicaciones: number;
  rutinas: number;
  seguidores: number;
  seguidos: number;
}

export interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onInteraction?: () => void;
  onCommentClick?: () => void;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name?: string;
    profilePic?: string;
  };
  parentId?: number;
  likesCount: number;
  liked: boolean;
  repliesCount: number;
}
