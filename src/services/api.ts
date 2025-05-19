
import { SubjectInfo, StudyPlan, StudySession } from "@/types/studyPlanner";

// Set this to your deployed backend URL when in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.VITE_API_BASE_URL || 'https://studysavvy-backend.up.railway.app/api'
  : 'http://localhost:5000/api';

// API functions for subjects
export const fetchSubjects = async (): Promise<SubjectInfo[]> => {
  const response = await fetch(`${API_BASE_URL}/subjects`);
  if (!response.ok) {
    throw new Error('Failed to fetch subjects');
  }
  return response.json();
};

export const addSubject = async (subject: SubjectInfo): Promise<SubjectInfo> => {
  const response = await fetch(`${API_BASE_URL}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subject),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add subject');
  }
  
  return response.json();
};

export const removeSubject = async (subjectId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove subject');
  }
};

// API functions for study plan
export const generateStudyPlan = async (
  subjects: SubjectInfo[], 
  availableTimes: { day: string; hours: number; }[],
  startDate: Date,
  endDate: Date
): Promise<StudyPlan> => {
  const response = await fetch(`${API_BASE_URL}/study-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subjects,
      availableTimes,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate study plan');
  }
  
  return response.json();
};

export const updateStudySession = async (
  sessionId: string, 
  updates: Partial<StudySession>
): Promise<StudySession> => {
  const response = await fetch(`${API_BASE_URL}/study-sessions/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update study session');
  }
  
  return response.json();
};
