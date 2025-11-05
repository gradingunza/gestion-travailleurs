// src/components/WorkerList.tsx
import React, { useState, useEffect } from 'react'
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
    if (!isUserLoggedIn) return // Empêcher l'édition si l'utilisateur n'est pas connecté
    setEditingWorker(worker)
  }

  const handleView = (worker: Worker) => {
    setViewingWorker(worker)
  }

  const handleDelete = async (workerId: string) => {
    if (!isUserLoggedIn) return // Empêcher la suppression si l'utilisateur n'est pas connecté
    
    try {
      const { error } = await supabase
        .from('travailleurs')
        .delete()
        .eq('id', workerId)

      if (error) throw error

      showMessage('success', 'Travailleur supprimé avec succès')
      setDeleteConfirm(null)
      fetchWorkers() // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur:', error)
      showMessage('error', 'Erreur lors de la suppression')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingWorker || !isUserLoggedIn) return // Empêcher la mise à jour si l'utilisateur n'est pas connecté

    try {
      const { error } = await supabase
        .from('travailleurs')
        .update({
          nom: editingWorker.nom,
          postnom: editingWorker.postnom,
          prenom: editingWorker.prenom,
          telephone: editingWorker.telephone,
          departement: editingWorker.departement,
          sexe: editingWorker.sexe,
          niveau_etudes: editingWorker.niveau_etudes,
          date_adhesion: editingWorker.date_adhesion
        })
        .eq('id', editingWorker.id)

      if (error) throw error

      showMessage('success', 'Travailleur modifié avec succès')
      setEditingWorker(null)
      fetchWorkers() // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur:', error)
      showMessage('error', 'Erreur lors de la modification')
    }
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

      {/* Header Mobile Optimisé */}
      <div className="worker-list-header">
        <div className="header-top">
          <div className="header-content">
            <h1>Gestion des Travailleurs</h1>
            <p>Consultez et gérez les collaborateurs</p>
          </div>
          
          <div className="user-info-mobile">
            <div className="user-avatar-mobile">
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
            </div>
            <div className="user-details-mobile">
              <div className="user-email-mobile" title={userEmail}>
                {userEmail ? userEmail.split('@')[0] : 'Utilisateur'}
              </div>
              <div className="user-status">
                {isUserLoggedIn ? 'Connecté' : 'Non connecté'}
              </div>
            </div>
            <div className={`status-dot-mobile ${isUserLoggedIn ? 'connected' : 'disconnected'}`}></div>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{workers.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{filteredWorkers.length}</span>
            <span className="stat-label">Résultats</span>
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
                          onClick={() => isUserLoggedIn && setDeleteConfirm(worker.id)}
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

      {/* Modal de modification */}
      {editingWorker && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Modifier le travailleur</h3>
              <button 
                className="modal-close"
                onClick={() => setEditingWorker(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={editingWorker.nom}
                    onChange={(e) => setEditingWorker({...editingWorker, nom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Postnom</label>
                  <input
                    type="text"
                    value={editingWorker.postnom}
                    onChange={(e) => setEditingWorker({...editingWorker, postnom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={editingWorker.prenom}
                    onChange={(e) => setEditingWorker({...editingWorker, prenom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={editingWorker.telephone}
                    onChange={(e) => setEditingWorker({...editingWorker, telephone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Département</label>
                  <select
                    value={editingWorker.departement}
                    onChange={(e) => setEditingWorker({...editingWorker, departement: e.target.value})}
                    required
                  >
                    {departments.filter(dept => dept !== 'Tous les départements').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Niveau d'études</label>
                  <select
                    value={editingWorker.niveau_etudes}
                    onChange={(e) => setEditingWorker({...editingWorker, niveau_etudes: e.target.value})}
                    required
                  >
                    <option value="Secondaire">Secondaire</option>
                    <option value="D6">D6</option>
                    <option value="G3">G3</option>
                    <option value="L2">L2</option>
                    <option value="Master">Master</option>
                    <option value="Doctorat">Doctorat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sexe</label>
                  <select
                    value={editingWorker.sexe}
                    onChange={(e) => setEditingWorker({...editingWorker, sexe: e.target.value})}
                    required
                  >
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date d'adhésion</label>
                  <input
                    type="date"
                    value={editingWorker.date_adhesion}
                    onChange={(e) => setEditingWorker({...editingWorker, date_adhesion: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingWorker(null)}>
                  Annuler
                </button>
                <button type="submit" className="primary" disabled={!isUserLoggedIn}>
                  {isUserLoggedIn ? 'Enregistrer' : 'Non connecté'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {viewingWorker && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Détails du travailleur</h3>
              <button 
                className="modal-close"
                onClick={() => setViewingWorker(null)}
              >
                ×
              </button>
            </div>
            <div className="worker-details-modal">
              <div className="detail-section">
                <h4>Informations personnelles</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nom complet:</span>
                    <span className="detail-value">{viewingWorker.prenom} {viewingWorker.nom} {viewingWorker.postnom}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Sexe:</span>
                    <span className="detail-value">{viewingWorker.sexe}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Téléphone:</span>
                    <span className="detail-value">{viewingWorker.telephone}</span>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>Informations professionnelles</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Département:</span>
                    <span className="detail-value">{viewingWorker.departement}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Niveau d'études:</span>
                    <span className="detail-value">{viewingWorker.niveau_etudes}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date d'adhésion:</span>
                    <span className="detail-value">
                      {new Date(viewingWorker.date_adhesion).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>Informations système</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value monospace">{viewingWorker.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date de création:</span>
                    <span className="detail-value">
                      {new Date(viewingWorker.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setViewingWorker(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button 
                className="modal-close"
                onClick={() => setDeleteConfirm(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Êtes-vous sûr de vouloir supprimer ce travailleur ? Cette action est irréversible.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)}>
                Annuler
              </button>
              <button 
                className="danger"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={!isUserLoggedIn}
              >
                {isUserLoggedIn ? 'Supprimer' : 'Non connecté'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkerList