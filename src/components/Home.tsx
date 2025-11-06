// src/components/Home.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

const Home: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserEmail(user.email)
        } else {
          navigate('/auth')
        }
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error)
        navigate('/auth')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleAddWorker = () => {
    navigate('/add-worker')
  }

  const handleViewWorkers = () => {
    navigate('/worker-list')
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  const userName = userEmail ? userEmail.split('@')[0] : 'Utilisateur'

  return (
    <div className="home-container">
      {/* Header Mobile Optimisé */}
      <div className="home-header-mobile">
        <div className="header-content-mobile">
          <h1>Bienvenue, {userName} !</h1>
          <p>Gestion optimale des agents</p>
        </div>
        
        <div className="user-profile-mobile">
          <div className="user-avatar-mobile">
            {userName[0].toUpperCase()}
          </div>
          <div className="user-status-mobile">
            <div className="status-dot-mobile online"></div>
            <span>En ligne</span>
          </div>
        </div>
      </div>

      {/* Section de bienvenue optimisée mobile */}
      <div className="welcome-section-mobile">
        <div className="welcome-card-mobile">
          <div className="welcome-icon-mobile">🎯</div>
          <h2>Gestion des Travailleurs</h2>
          <p className="welcome-description-mobile">
            Ce logiciel vous permet d'enregistrer de manière <strong>efficace et optimale</strong><br></br> 
            les agents de votre structure.
          </p>
          
          <div className="features-grid-mobile">
            <div className="feature-item-mobile">
              <div className="feature-icon-mobile">📝</div>
              <div className="feature-content">
                <h3>Ajout Simplifié</h3>
                <p>Formulaire intuitif</p>
              </div>
            </div>
            <div className="feature-item-mobile">
              <div className="feature-icon-mobile">👥</div>
              <div className="feature-content">
                <h3>Gestion Centralisée</h3>
                <p>Interface unique</p>
              </div>
            </div>
            <div className="feature-item-mobile">
              <div className="feature-icon-mobile">🔍</div>
              <div className="feature-content">
                <h3>Recherche Avancée</h3>
                <p>Trouvez rapidement</p>
              </div>
            </div>
            <div className="feature-item-mobile">
              <div className="feature-icon-mobile">🏢</div>
              <div className="feature-content">
                <h3>Organisation</h3>
                <p>Par département</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des actions principales optimisée mobile */}
      <div className="actions-section-mobile">
        <h2 className="section-title-mobile">Actions Rapides</h2>
        <div className="actions-grid-mobile">
          <button className="action-card-mobile primary" onClick={handleAddWorker}>
            <div className="action-content-mobile">
              <div className="action-icon-mobile">➕</div>
              <div className="action-text-mobile">
                <h3>Ajouter un Travailleur</h3>
                <p>Nouvel agent</p>
              </div>
            </div>
            <span className="action-arrow-mobile">→</span>
          </button>

          <button className="action-card-mobile secondary" onClick={handleViewWorkers}>
            <div className="action-content-mobile">
              <div className="action-icon-mobile">👥</div>
              <div className="action-text-mobile">
                <h3>Voir la Liste</h3>
                <p>Tous les agents</p>
              </div>
            </div>
            <span className="action-arrow-mobile">→</span>
          </button>
        </div>
      </div>

      {/* Bouton de déconnexion mobile */}
      <div className="logout-section-mobile">
        <button className="logout-btn-mobile" onClick={handleLogout}>
          <span className="logout-icon-mobile">🚪</span>
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  )
}

export default Home