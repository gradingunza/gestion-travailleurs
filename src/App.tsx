// src/App.tsx
import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { supabase } from './supabase/client'
import Auth from './components/Auth'
import AddWorker from './components/AddWorker'
import WorkerList from './components/WorkerList'
import './App.css'

type ActiveTab = 'add' | 'list'

const App: React.FC = () => {
  const { session, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>('add')

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log('Error logging out:', error)
  }

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Gestion des Travailleurs</h1>
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          Ajouter un travailleur
        </button>
        <button 
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          Liste des travailleurs
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'add' && <AddWorker />}
        {activeTab === 'list' && <WorkerList />}
      </main>
    </div>
  )
}

export default App