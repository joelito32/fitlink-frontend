'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Post, Comment as ApiComment } from '@/lib/api/types'
import PostCard from './PostCard'
import CommentCard from './CommentCard'
import { IoClose } from 'react-icons/io5'
import {
  fetchComments,
  postComment,
  deleteComment,
} from '@/lib/api/api'

interface FullPostProps {
  post: Post
  onClose: () => void
}

export default function FullPost({ post, onClose }: FullPostProps) {
  const [comments, setComments] = useState<ApiComment[]>([])
  const [newText, setNewText] = useState('')
  const [sending, setSending] = useState(false)
  const [replyTo, setReplyTo] = useState<ApiComment | null>(null)

  const loadComments = async () => {
    try {
      const fetched = await fetchComments(post.id)
      setComments(fetched)
    } catch (err) {
      console.error('Error cargando comentarios:', err)
    }
  }

  useEffect(() => {
    loadComments()
  }, [post.id])

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newText.trim()) return

    setSending(true)
    try {
      await postComment(post.id, newText, replyTo?.id)
      setNewText('')
      setReplyTo(null)
      await loadComments()
    } catch (err) {
      console.error('Error creando comentario:', err)
    } finally {
      setSending(false)
    }
  }


  const handleDelete = async (cmt: ApiComment) => {
    try {
      await deleteComment(cmt.id)
      await loadComments()
    } catch (err) {
      console.error('Error eliminando comentario:', err)
    }
  }

  const handleReplyClick = (comment: ApiComment) => {
    setReplyTo(comment)
    setNewText('')
  }

  const topComments = comments.filter(c => c.parentId == null)

  return (
    <div className="text-white shadow-lg p-3 w-full">
      {/* Cerrar */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="text-gray-600 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Post completo */}
      <div className="mt-4">
        <PostCard post={post} onInteraction={() => {}} />
      </div>

      {/* Comentarios */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">
          Comentarios ({topComments.length})
        </h3>

        {topComments.length === 0 ? (
          <p className="text-gray-500">Sé el primero en comentar</p>
        ) : (
          topComments.map(c => (
            <CommentCard
              key={c.id}
              comment={c}
              onReplyClick={handleReplyClick}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Formulario nuevo comentario */}
      <form onSubmit={handleSend} className="mt-6 border-t border-gray-200 pt-4">
        {replyTo && (
          <div className="flex items-center bg-gray-800 px-2 py-1 rounded mb-2">
            <span className="text-sm text-gray-300">
              Respondiendo a @{replyTo.author.username}
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="ml-auto text-gray-400 hover:text-red-500"
              aria-label="Cancelar respuesta"
            >
              Cancelar
            </button>
          </div>
        )}
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder={
            replyTo
              ? `Respondiendo a @${replyTo.author.username}...`
              : 'Escribe tu comentario...'
          }
          rows={3}
          className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53]"
          disabled={sending}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={sending || !newText.trim()}
            className="px-4 py-2 bg-[#1F7D53] hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  )
}
