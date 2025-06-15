'use client'

import { useState, useEffect } from 'react'
import { Comment } from '@/lib/api/types'
import { 
  fetchReplies, 
  likeComment, 
  unlikeComment, 
  fetchCommentLikesCount, 
  checkCommentLiked, 
  fetchCommentRepliesCount,
  deleteComment 
} from '@/lib/api/api'
import { IoIosArrowDown } from 'react-icons/io'
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5'
import { FiTrash2 } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import ConfirmarBorrarCom from './ConfirmarBorrarCom'

interface CommentCardProps {
  comment: Comment
  onReplyClick?: (comment: Comment) => void
  onDelete?: (comment: Comment) => void
}

export default function CommentCard({ comment, onReplyClick, onDelete }: CommentCardProps) {
  if (!comment) return null
  const router = useRouter()

  const {
    id,
    author,
    content,
    createdAt,
    parentId,
    liked: initialLiked,
    likesCount: initialLikes,
    repliesCount: propRepliesCount = 0,
  } = comment

  const [confirmTarget, setConfirmTarget] = useState<Comment | null>(null)
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked)
  const [likes, setLikes] = useState<number>(initialLikes)
  const [replyCount, setReplyCount] = useState<number>(propRepliesCount)
  const [showReplies, setShowReplies] = useState<boolean>(false)
  const [replies, setReplies] = useState<Comment[]>([])

  const formatCreatedAt = (dateStr: string): string => {
    const createdDate = new Date(dateStr)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 24) {
      return diffInHours === 0
        ? 'Hace menos de una hora'
        : `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    }
    return createdDate.toLocaleDateString('es-ES')
  }

  const loadInitialState = async () => {
    try {
      const [countLikes, likedFlag, countReplies] = await Promise.all([
        fetchCommentLikesCount(id),
        checkCommentLiked(id),
        fetchCommentRepliesCount(id),
      ])
      setLikes(countLikes)
      setIsLiked(likedFlag)
      setReplyCount(countReplies)
    } catch (err) {
      console.error('Error al cargar estado inicial:', err)
    }
  }

  const loadReplies = async () => {
    try {
      const data = await fetchReplies(id)
      setReplies(data)
      setShowReplies(true)
    } catch (error) {
      console.error('Error al cargar respuestas:', error)
    }
  }

  useEffect(() => {
    loadInitialState()
  }, [])

  useEffect(() => {
    setReplyCount(propRepliesCount)
    if (showReplies) {
      loadReplies()
    }
  }, [propRepliesCount])

  const handleToggleLike = async () => {
    try {
      if (isLiked) {
        await unlikeComment(id)
      } else {
        await likeComment(id)
      }
      loadInitialState()
    } catch (error) {
      console.error('Error al cambiar like:', error)
    }
  }

  const handleToggleReplies = () => {
    if (showReplies) {
      setShowReplies(false)
    } else {
      loadReplies()
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return
    const target = confirmTarget
    setConfirmTarget(null)

    try {
      await deleteComment(target.id)
      if (target.parentId) {
        if (showReplies) loadReplies()
        loadInitialState()
      } else {
        onDelete?.(target)
      }
    } catch (err) {
      console.error('Error al eliminar comentario:', err)
    }
  }


  return (
    <>
      {confirmTarget && (
        <ConfirmarBorrarCom
          onCancel={() => setConfirmTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      <div className="flex items-start space-x-3 p-4 bg-[#27391C] rounded-lg hover:shadow-lg transition-shadow  border-2 border-[#1F7D53] mb-3">
        <img
          src={author.profilePic || '/default-avatar.png'}
          alt={`${author.username} avatar`}
          className="w-8 h-8 rounded-full object-cover border border-gray-300"
        />

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p 
                className="text-sm font-medium text-white hover:underline cursor-pointer"
                onClick={() => router.push(`/inicio/perfil/${author.id}`)}
              >
                @{author.username}
              </p>
              <p className="text-gray-400 text-sm">{author.name}</p>
              <p className="text-xs text-gray-500">{formatCreatedAt(createdAt)}</p>
            </div>
            <button
              onClick={() => setConfirmTarget(comment)}
              className="text-gray-500 hover:text-red-500"
              aria-label="Eliminar comentario"
            >
              <FiTrash2 size={18} />
            </button>
          </div>

          <div className="mt-2 flex justify-between items-start gap-3">
            <p className="text-sm text-white flex-1">{content}</p>
            <div
              onClick={handleToggleLike}
              className="cursor-pointer flex items-center gap-1"
            >
              {isLiked ? <IoHeartSharp className="text-red-500" /> : <IoHeartOutline />}
              <span className="text-gray-400 text-sm">{likes}</span>
            </div>
          </div>
          <div className="mt-1 flex justify-end">
            <button
              onClick={() => onReplyClick?.(comment)}
              className="text-sm text-[#1F7D53] hover:underline"
              aria-label="Responder comentario"
            >
              Responder
            </button>
          </div>

          {!showReplies && replyCount > 0 && (
            <button
              onClick={handleToggleReplies}
              className="flex items-center text-sm text-[#1F7D53] hover:underline mt-2"
            >
              <IoIosArrowDown className="mr-1" />
              Mostrar respuestas ({replyCount})
            </button>
          )}

          {showReplies && (
            <>
              {replies.map(reply => (
                <div
                  key={reply.id}
                  className="flex items-start space-x-2 p-3 bg-[#27391C] ml-8 mt1 border-b-2 border-[#1F7D53]"
                >
                  <img
                    src={reply.author.profilePic || '/default-avatar.png'}
                    alt={`${reply.author.username} avatar`}
                    className="w-6 h-6 rounded-full object-cover border border-gray-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p 
                        className="text-xs font-medium text-white hover:underline cursor-pointer"
                        onClick={() => router.push(`/inicio/perfil/${reply.author.id}`)}
                      >
                        @{reply.author.username}
                      </p>
                      <p className="text-gray-300 text-xs">{reply.author.name}</p>
                      <p className="text-2xs text-gray-400">
                        {formatCreatedAt(reply.createdAt)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-white">{reply.content}</p>
                  </div>
                  <button
                    onClick={() => setConfirmTarget(reply)}
                    className="text-gray-500 hover:text-red-500 ml-auto"
                    aria-label="Eliminar respuesta"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={handleToggleReplies}
                className="flex items-center self-start text-sm text-[#1F7D53] hover:underline ml-8 mt-2"
              >
                <IoIosArrowDown className="mr-1 rotate-180" />
                Ocultar respuestas ({replyCount})
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
