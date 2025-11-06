// src/components/WorkerList.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import type { Worker } from '../types'

const departments = [
  'Tous les départements',
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
  'Nettoyage',
] as const

const WorkerList: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)
  const [viewingWorker, setViewingWorker] = useState<Worker | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWorkers()
    fetchUserEmail()
  }, [selectedDepartment])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('travailleurs')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedDepartment) {
        query = query.eq('departement', selectedDepartment)
      }

      const { data, error } = await query

      if (error) throw error
      setWorkers(data || [])
    } catch (error) {
      console.error('Erreur:', error)
      showMessage('error', 'Erreur lors du chargement des travailleurs')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserEmail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
        setIsUserLoggedIn(true)
      } else {
        setIsUserLoggedIn(false)
      }
    } catch (error) {
      console.error('Erreur récupération email:', error)
      setIsUserLoggedIn(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleEdit = (worker: Worker) => {
    if (!isUserLoggedIn) return
    setEditingWorker(worker)
  }

  const handleView = (worker: Worker) => {
    setViewingWorker(worker)
  }

  const handleDelete = async (workerId: string) => {
    if (!isUserLoggedIn) return
    
    try {
      const { error } = await supabase
        .from('travailleurs')
        .delete()
        .eq('id', workerId)

      if (error) throw error

      showMessage('success', 'Travailleur supprimé avec succès')
      setDeleteConfirm(null)
      fetchWorkers()
    } catch (error) {
      console.error('Erreur:', error)
      showMessage('error', 'Erreur lors de la suppression')
    }
  }
  const handleBack = () => {
    navigate('/home')
  }

  const handleAddWorker = () => {
    navigate('/add-worker')
  }

  const filteredWorkers = workers.filter(worker =>
    worker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.postnom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.niveau_etudes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.sexe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.telephone.includes(searchTerm)
  )

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Ressources Humaines': '#3b82f6',
      'Informatique': '#8b5cf6',
      'Finance': '#10b981',
      'Marketing': '#f59e0b',
      'Protocole': '#ef4444',
      'Logistique': '#06b6d4',
      'Gestion de stock': '#8b5cf6',
      'Restauration': '#f59e0b',
      'Formateur': '#10b981',
      'Secretaire': '#3b82f6',
      'Juridique': '#ef4444',
      'Assistant(e)': '#06b6d4',
      'Nettoyage': '#6b7280'
    }
    return colors[department] || '#6b7280'
  }

  const getEducationColor = (education: string) => {
    const colors: { [key: string]: string } = {
      'Secondaire': '#6b7280',
      'D6': '#3b82f6',
      'G3': '#10b981',
      'L2': '#8b5cf6',
      'Master': '#f59e0b',
      'Doctorat': '#ef4444',
      'Autre': '#06b6d4'
    }
    return colors[education] || '#6b7280'
  }

  const getGenderColor = (gender: string) => {
    const colors: { [key: string]: string } = {
      'Masculin': '#3b82f6',
      'Féminin': '#ec4899',
      'Autre': '#6b7280'
    }
    return colors[gender] || '#6b7280'
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large">
          <div className="spinner"></div>
          <p>Chargement des travailleurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="worker-list-container">
      {/* Message de notification */}
      {message && (
        <div className={`message ${message.type} global-message`}>
          {message.text}
        </div>
      )}

      {/* Boutons de navigation - VERSION AMÉLIORÉE */}
      <div className="navigation-buttons top-position">
        <button onClick={handleAddWorker} className="primary-btn">
          <span className="btn-icon">➕</span>
          Ajouter un travailleur
        </button>
        <button onClick={handleBack} className="back-btn">
          <span className="btn-icon">🏠</span>
          Retour à l'accueil
        </button>
      </div>

      {/* Header avec Affichage Utilisateur Amélioré */}
      <div className="worker-list-header">
        
        <div className="header-top">
          <div className="header-with-back">
            <button className="back-button" onClick={handleBack}>
              <span className="back-arrow">←</span>
              Retour
            </button>
            <div className="header-content">
              <h1>Gestion des Travailleurs</h1>
              <p>Consultez et gérez les collaborateurs</p>
            </div>
          </div>
          
          {/* Affichage Utilisateur Connecté - Version Améliorée */}
          <div className={`user-profile-card ${isUserLoggedIn ? 'connected' : 'disconnected'}`}>
            <div className="user-profile-main">
              <div className="user-avatar-wrapper">
                <div className="user-avatar">
                  {userEmail ? userEmail[0].toUpperCase() : 'U'}
                </div>
                <div className={`connection-status ${isUserLoggedIn ? 'online' : 'offline'}`}></div>
              </div>
              <div className="user-info">
                <div className="user-identity">
                  <span className="user-name">
                    {userEmail ? userEmail.split('@')[0] : 'Invité'}
                  </span>
                  <span className="user-role">
                    {isUserLoggedIn ? 'Administrateur' : 'Visiteur'}
                  </span>
                </div>
                <div className="user-email" title={userEmail}>
                  {userEmail || 'Non connecté'}
                </div>
              </div>
            </div>
            <div className="user-stats">
              <div className="user-stat">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{workers.length}</span>
                <span className="stat-label">Travailleurs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Globales */}
        <div className="header-stats">
          <div className="stat-card primary">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-number">{workers.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-icon">🔍</div>
            <div className="stat-content">
              <span className="stat-number">{filteredWorkers.length}</span>
              <span className="stat-label">Résultats</span>
            </div>
          </div>
          <div className="stat-card accent">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <span className="stat-number">
                {[...new Set(workers.map(w => w.departement))].length}
              </span>
              <span className="stat-label">Départements</span>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="department-filter" className="filter-label">
              Filtre par département
            </label>
            <select 
              id="department-filter"
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'Tous les départements' ? '' : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search-filter" className="filter-label">
              Rechercher
            </label>
            <div className="search-input-container">
              <input
                id="search-filter"
                type="text"
                placeholder="Rechercher un travailleur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>

        <div className="active-filters">
          {selectedDepartment && (
            <span className="active-filter-tag">
              Département: {selectedDepartment}
              <button 
                onClick={() => setSelectedDepartment('')}
                className="clear-filter-btn"
              >
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="active-filter-tag">
              Recherche: "{searchTerm}"
              <button 
                onClick={() => setSearchTerm('')}
                className="clear-filter-btn"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Liste des Travailleurs</h2>
          <span className="results-count">
            {filteredWorkers.length} résultat{filteredWorkers.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>Aucun travailleur trouvé</h3>
            <p>
              {workers.length === 0 
                ? "Commencez par ajouter votre premier travailleur."
                : "Aucun résultat ne correspond à vos critères de recherche."
              }
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="workers-table">
              <thead>
                <tr>
                  <th className="name-col">Nom Complet</th>
                  <th className="phone-col">Téléphone</th>
                  <th className="gender-col">Sexe</th>
                  <th className="dept-col">Département</th>
                  <th className="education-col">Niveau d'études</th>
                  <th className="date-col">Date d'adhésion</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker, index) => (
                  <tr key={worker.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td className="name-cell">
                      <div className="worker-info">
                        <div className="worker-avatar">
                          {worker.prenom[0]}{worker.nom[0]}
                        </div>
                        <div className="worker-details">
                          <div className="worker-name">
                            {worker.prenom} {worker.nom} {worker.postnom}
                          </div>
                          <div className="worker-id">ID: {worker.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="phone-cell">
                      <div className="phone-value">{worker.telephone}</div>
                    </td>
                    <td className="gender-cell">
                      <span 
                        className="gender-badge"
                        style={{ backgroundColor: getGenderColor(worker.sexe) }}
                      >
                        {worker.sexe}
                      </span>
                    </td>
                    <td className="dept-cell">
                      <span 
                        className="department-badge"
                        style={{ backgroundColor: getDepartmentColor(worker.departement) }}
                      >
                        {worker.departement}
                      </span>
                    </td>
                    <td className="education-cell">
                      <span 
                        className="education-badge"
                        style={{ backgroundColor: getEducationColor(worker.niveau_etudes) }}
                      >
                        {worker.niveau_etudes}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(worker.date_adhesion).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <button 
                          className={`action-btn primary ${!isUserLoggedIn ? 'disabled' : ''}`} 
                          title={isUserLoggedIn ? "Modifier" : "Connectez-vous pour modifier"}
                          onClick={() => handleEdit(worker)}
                          disabled={!isUserLoggedIn}
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn secondary" 
                          title="Voir détails"
                          onClick={() => handleView(worker)}
                        >
                          👁️
                        </button>
                        <button 
                          className={`action-btn danger ${!isUserLoggedIn ? 'disabled' : ''}`} 
                          title={isUserLoggedIn ? "Supprimer" : "Connectez-vous pour supprimer"}
                          onClick={() => {
                            if (isUserLoggedIn) {
                              handleDelete(worker.id);
                            }
                          }}
                          disabled={!isUserLoggedIn}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Les modaux restent inchangés */}
      {editingWorker && (
        <div className="modal-overlay">
          {/* ... modal de modification ... */}
        </div>
      )}

      {viewingWorker && (
        <div className="modal-overlay">
          {/* ... modal de détails ... */}
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          {/* ... modal de suppression ... */}
        </div>
      )}
    </div>
  )
}

export default WorkerList