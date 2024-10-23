import { useSession } from 'next-auth/react'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.isAdmin ?? false
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  return {
    session,
    isAdmin,
    isAuthenticated,
    isLoading,
  }
}