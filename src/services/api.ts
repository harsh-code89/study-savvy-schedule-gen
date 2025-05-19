import { SubjectInfo, StudyPlan, StudySession } from "@/types/studyPlanner";

// Set this to your deployed backend URL when in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.VITE_API_BASE_URL || 'https://studysavvy-backend.up.railway.app/api'
  : 'http://localhost:5000/api';

// API functions for subjects
export const fetchSubjects = async (): Promise<SubjectInfo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`);
    if (!response.ok) {
      console.error('Failed to fetch subjects', response.status, response.statusText);
      return []; // Return empty array instead of throwing to prevent app from crashing
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return []; // Return empty array on error to prevent app from crashing
  }
};

export const addSubject = async (subject: SubjectInfo): Promise<SubjectInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subject),
    });
    
    if (!response.ok) {
      console.error('Failed to add subject', response.status, response.statusText);
      throw new Error('Failed to add subject');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error adding subject:', error);
    throw error;
  }
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
  try {
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
      console.error('Failed to generate study plan', response.status, response.statusText);
      throw new Error('Failed to generate study plan');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
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
