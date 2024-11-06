'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Bell, Shield, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from '@/hooks/use-toast'


interface UserSettings {
  name: string
  email: string
  avatarUrl: string
 
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/settings')
      setSettings(response.data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (settings) {
      setSettings({ ...settings, [e.target.name]: e.target.value })
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put('/api/settings', settings)
      toast({
        title: "Success",
        description: "Your settings have been updated.",
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="animate-pulse flex space-x-4">
        <div className="h-12 w-12 rounded-full bg-violet-200"></div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-violet-200 rounded"></div>
          <div className="h-4 w-36 bg-violet-200 rounded"></div>
        </div>
      </div>
    </div>
    )
  }

  if (!settings) {
    return <div>Error loading settings</div>
  }

  return (
    <div className="container mx-auto py-10 px-4 mt-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={settings.avatarUrl} alt={settings.name} />
                <AvatarFallback>{settings.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
              <Input
                id="name"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                className="max-w-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="max-w-md"
              />
            </div>
          
          </CardContent>
        </Card>

       

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full sm:w-auto">
              <Lock className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Shield className="mr-2 h-4 w-4" /> Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}