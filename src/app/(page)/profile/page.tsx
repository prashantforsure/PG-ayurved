'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, Edit2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string
  bio: string
  joinedDate: string
  enrolledCourses: number
  completedCourses: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/profile')
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return <div>Error loading profile</div>
  }

  return (
    <div className="container mx-auto py-10 px-4 mt-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl font-bold mb-2">{profile.name}</CardTitle>
            <p className="text-gray-500 mb-4">{profile.bio}</p>
            <Button onClick={() => router.push('/settings')} className="bg-blue-500 hover:bg-blue-600">
              <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Mail className="mr-2 h-5 w-5" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Enrolled Courses</span>
                <span className="font-semibold">{profile.enrolledCourses}</span>
              </div>
            
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4 mt-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="w-full">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}