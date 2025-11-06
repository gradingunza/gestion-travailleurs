// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth'
import Home from './components/home'
import AddWorker from './components/AddWorker'
import WorkerList from './components/WorkerList'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/add-worker" element={
            <ProtectedRoute>
              <AddWorker />
            </ProtectedRoute>
          } />
          <Route path="/worker-list" element={
            <ProtectedRoute>
              <WorkerList />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App