// src/types/index.ts
export interface Worker {
  id: string;
  nom: string;
  postnom: string;
  prenom: string;
  telephone: string;
  departement: string;
  niveau_etudes: string;
  sexe:string,
  date_adhesion: string;
  created_by: string;
  created_at: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface WorkerFormData {
  nom: string;
  postnom: string;
  prenom: string;
  telephone: string;
  departement: string;
  niveau_etudes: string;
  sexe:string,
  date_adhesion: string;
}