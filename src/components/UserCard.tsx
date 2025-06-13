import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmarUnfollow from './ConfirmarUnfollow';

interface UserCardProps {
    id: number;
    username: string;
    name?: string;
    profilePic?: string;
    onClick?: () => void;
}

export default function UserCard({ id, username, name, profilePic, onClick }: UserCardProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [mostrarConfirmarUnfollow, setMostrarConfirmarUnfollow] = useState(false)
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => setCurrentUserId(data.id))
            .catch(() => setCurrentUserId(null))
            .finally(() => setIsReady(true));
    }, [API_URL]);

    useEffect(() => {
        if (!isReady || currentUserId === null || id === currentUserId) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${API_URL}/api/followers/is-following/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => setIsFollowing(data.isFollowing))
            .catch(() => setIsFollowing(false));
    }, [id, API_URL, currentUserId, isReady]);

    const handleFollowClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (isFollowing) {
            setMostrarConfirmarUnfollow(true)
        }  else {
            try {
                const res = await fetch(`${API_URL}/api/followers/follow/${id}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setIsFollowing(true);
                }
            } catch (err) {
                console.error('Error al seguir', err);
            }
        }
    };

    const handleUnfollowConfirm = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/api/followers/unfollow/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setIsFollowing(false);
                setMostrarConfirmarUnfollow(false);
            }
        } catch (err) {
            console.error('Error al dejar de seguir', err);
        }
    };

    if (!isReady || currentUserId === id) return null;

    return (
        <div
            className="flex justify-between bg-[#27391C] p-4 rounded-lg shadow-md text-white relative mb-3 border-2 border-[#1F7D53]"
            onClick={() => router.push(`perfil/${id}`)}
        >
            <div className="flex gap-5">
                <img
                    src={profilePic || '/default-avatar.png'}
                    alt={`${username}'s profile picture`}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <p className="text-white font-medium">@{username}</p>
                    {name && <p className="text-gray-400 text-sm">{name}</p>}
                </div>
            </div>
            <button 
                className={`px-4 py-1 rounded-xl text-sm font-medium transition-colors ${isFollowing ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#1F7D53] text-white hover:bg-[#186345]'}`}
                onClick={(e) => {
                    e.stopPropagation()
                    handleFollowClick(e)
                }}
            >
                {isFollowing ? 'Dejar de seguir' : 'Seguir'}
            </button>
            {mostrarConfirmarUnfollow && (
                <div onClick={(e) => e.stopPropagation()}>
                    <ConfirmarUnfollow 
                        onCancel={() => setMostrarConfirmarUnfollow(false)}
                        onConfirm={handleUnfollowConfirm}
                    />
                </div>
            )}
        </div>
    );
}