'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileSlider from '@/components/ProfileSlider'

interface UserProfile {
    name?: string
    birthdate?: string
    bio?: string
    profilePic?: string
    weight?: number
}

export default function CompleteProfilePage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [mode, setMode] = useState<'initial' | 'edit'>('initial')
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/page')
            return
        }

        fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('No autorizado')
                return res.json()
            })
            .then(data => {
                if (!data || typeof data !== 'object') throw new Error('Datos inválidos')
                
                const profileWithFullPic = {
                    ...data,
                    profilePic: data.profilePic
                        ? `${process.env.NEXT_PUBLIC_API_URL}${data.profilePic}`
                        : null,
                }
                setProfile(profileWithFullPic)

                const hasAny = 
                    Boolean(data.name) || 
                    Boolean(data.birthdate) || 
                    Boolean(data.bio) || 
                    Boolean(data.profilePic) || 
                    data.weight != null
                    
                setMode(hasAny ? 'edit' : 'initial')
            })
            .catch(() => setMode('edit'))
            .finally(() => setLoading(false))
    }, [router])

    if (loading || !profile) {
        return null
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1F7D53] p-4">
            <div className="w-[80vw] h-[80vh]">
                <ProfileSlider mode={mode} profile={profile} />
            </div>
        </div>
    )
}
