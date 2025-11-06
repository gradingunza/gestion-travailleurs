// src/components/AddWorker.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import type { WorkerFormData } from '../types'

const departments = [
  'Ressources Humaines',
  'Informatique',
  'Finance',
  'Marketing',
  'Protocole',
  'Logistique',
  'Gestion de stock',
  'Restauration',
  'Formateur',
  'Secretaire',
  'Juridique',
  'Assistant(e)',
  'Nettoyage'
] as const

const educationLevels = [
  'Secondaire',
  'D6',
  'G3',
  'L2',
  'Master',
  'Doctorat',
  'Autre'
] as const

const genders = [
  'Masculin',
  'Féminin',
  'Autre'
] as const

const AddWorker: React.FC = () => {
  const [formData, setFormData] = useState<WorkerFormData>({
    nom: '',
    postnom: '',
    prenom: '',
    telephone: '',
    departement: '',
    sexe: '',
    date_adhesion: '',
    niveau_etudes: ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const navigate = useNavigate()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (message) setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Utilisateur non connecté')

      const { error } = await supabase
        .from('travailleurs')
        .insert([
          {
            ...formData,
            created_by: user.id,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Travailleur ajouté avec succès!'
      })
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        postnom: '',
        prenom: '',
        telephone: '',
        departement: '',
        sexe: '',
        date_adhesion: '',
        niveau_etudes: ''
      })

    } catch (error) {
      console.error('Erreur:', error)
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'ajout: ' + (error instanceof Error ? error.message : 'Une erreur est survenue')
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/home')
  }

  const handleViewWorkers = () => {
    navigate('/worker-list')
  }

  return (
    <div className="add-worker-container">
      {/* Boutons de navigation - VERSION AMÉLIORÉE */}
      <div className="navigation-buttons top-position">
        <button onClick={handleViewWorkers} className="secondary-btn">
          <span className="btn-icon">👥</span>
          Voir la liste
        </button>
        <button onClick={handleBack} className="back-btn">
          <span className="btn-icon">🏠</span>
          Retour à l'accueil
        </button>
      </div>

      <div className="add-worker-card">
        {/* Header avec bouton retour */}
        <div className="form-header-mobile">
          <div className="header-with-back">
            <div className="header-content-mobile">
              <h2>Ajouter un Travailleur</h2>
              <p>Nouveau collaborateur</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`message ${message.type} mobile-message`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="worker-form-mobile">
          <div className="form-grid-mobile">
            <div className="form-group-mobile">
              <label htmlFor="nom" className="form-label-mobile">Nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input-mobile"
              />
            </div>

            <div className="form-group-mobile">
              <label htmlFor="postnom" className="form-label-mobile">Postnom *</label>
              <input
                type="text"
                id="postnom"
                name="postnom"
                placeholder="Postnom"
                value={formData.postnom}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input-mobile"
              />
            </div>

            <div className="form-group-mobile">
              <label htmlFor="prenom" className="form-label-mobile">Prénom *</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input-mobile"
              />
            </div>

            <div className="form-group-mobile">
              <label htmlFor="sexe" className="form-label-mobile">Sexe *</label>
              <select
                id="sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select-mobile"
              >
                <option value="">Sélectionnez le sexe</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            <div className="form-group-mobile">
              <label htmlFor="telephone" className="form-label-mobile">Téléphone *</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                placeholder="+243 XX XXX XXXX"
                value={formData.telephone}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input-mobile"
              />
            </div>

            <div className="form-group-mobile">
              <label htmlFor="departement" className="form-label-mobile">Département *</label>
              <select
                id="departement"
                name="departement"
                value={formData.departement}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select-mobile"
              >
                <option value="">Sélectionnez un département</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group-mobile">
              <label htmlFor="niveau_etudes" className="form-label-mobile">Niveau d'études *</label>
              <select
                id="niveau_etudes"
                name="niveau_etudes"
                value={formData.niveau_etudes}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select-mobile"
              >
                <option value="">Sélectionnez le niveau</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group-mobile">
              <label htmlFor="date_adhesion" className="form-label-mobile">Date d'adhésion *</label>
              <input
                type="date"
                id="date_adhesion"
                name="date_adhesion"
                value={formData.date_adhesion}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input-mobile"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn-mobile"
          >
            {loading ? (
              <span className="loading-spinner-mobile">
                <div className="spinner-mobile"></div>
                Ajout...
              </span>
            ) : (
              'Ajouter le travailleur'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddWorker