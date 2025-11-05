// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js' // Ajoutez 'type'
import { supabase } from '../supabase/client'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}