// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import type { User } from '@supabase/supabase-js'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Erreur de vérification auth:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Correction: utilisation correcte du paramètre event
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          navigate('/login')
        } else {
          setUser(session.user)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large">
          <div className="spinner"></div>
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : null
}

export default ProtectedRoute