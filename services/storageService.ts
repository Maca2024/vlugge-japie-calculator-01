import { JapieResponse } from "../types";

const STORAGE_KEY = 'japie_projects_v1';
const ID_SEQUENCE_KEY = 'japie_id_seq';

export const saveProject = (data: JapieResponse): JapieResponse => {
  // 1. Get current sequence ID
  const currentSeq = parseInt(localStorage.getItem(ID_SEQUENCE_KEY) || '1000', 10);
  const newId = currentSeq + 1;
  localStorage.setItem(ID_SEQUENCE_KEY, newId.toString());

  // 2. Prepare record (without imageBase64 to save space)
  const projectRecord: JapieResponse = {
    ...data,
    id: `#${newId}`,
    imageBase64: undefined, // Don't store large base64 strings in localStorage
    timestamp: Date.now()
  };

  // 3. Save to history
  const history = getProjects();
  history.unshift(projectRecord); // Add to top
  
  // Prune if too large (max 20 projects for this demo)
  if (history.length > 20) {
    history.pop();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Storage quota exceeded", e);
    // If still failing, just save the latest project
    localStorage.setItem(STORAGE_KEY, JSON.stringify([projectRecord]));
  }

  return projectRecord;
};

export const getProjects = (): JapieResponse[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const getProjectById = (id: string): JapieResponse | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === id);
};
