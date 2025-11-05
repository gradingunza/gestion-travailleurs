// src/components/Auth.tsx
import React, { useState } from 'react'
import { supabase } from '../supabase/client'
import type { AuthFormData } from '../types'

type AuthMode = 'login' | 'signup'

const Auth: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear message when user starts typing
    if (message) setMessage(null)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setMessage(null)

      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error
        
        if (data.user && !data.user.identities?.length) {
          setMessage({
            type: 'error',
            text: 'Un utilisateur avec cet email existe déjà.'
          })
          return
        }
        
        setMessage({
          type: 'success',
          text: 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
        })
        setAuthMode('login')
        setFormData({ email: '', password: '' })
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        if (error) throw error
      }
    } catch (error) {
      console.error('Erreur auth:', error)
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      setMessage({
        type: 'error',
        text: `Erreur: ${errorMessage}`
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login')
    setFormData({ email: '', password: '' })
    setMessage(null)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{authMode === 'login' ? 'Connexion' : 'Inscription'}</h2>
          <p className="auth-subtitle">
            {authMode === 'login' 
              ? 'Content de vous revoir ! Connectez-vous à votre compte.' 
              : 'Rejoignez-nous ! Créez votre compte en quelques secondes.'}
          </p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
            {authMode === 'signup' && (
              <span className="password-hint">Minimum 6 caractères</span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <span className="loading-spinner">
                <div className="spinner"></div>
                Chargement...
              </span>
            ) : (
              authMode === 'login' ? 'Se connecter' : "S'inscrire"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="auth-switch">
          <p>
            {authMode === 'login' ? "Pas de compte ?" : "Déjà un compte ?"}
            <button 
              type="button" 
              onClick={toggleAuthMode} 
              className="link-button"
              disabled={loading}
            >
              {authMode === 'login' ? "Créer un compte" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth