
import { SubjectInfo, StudyPlan, StudySession } from "@/types/studyPlanner";

// Set this to your deployed backend URL when in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.VITE_API_BASE_URL || 'https://studysavvy-backend.up.railway.app/api'
  : 'http://localhost:5000/api';

// Fallback storage functions
const STORAGE_KEYS = {
  SUBJECTS: 'studysavvy_subjects',
  SESSIONS: 'studysavvy_sessions'
};

const getStoredSubjects = (): SubjectInfo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeSubjects = (subjects: SubjectInfo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch (error) {
    console.error('Failed to store subjects:', error);
  }
};

// Check if backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
      method: 'GET',
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// API functions for subjects
export const fetchSubjects = async (): Promise<SubjectInfo[]> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('Backend not available, using local storage');
      return getStoredSubjects();
    }
    
    const response = await fetch(`${API_BASE_URL}/subjects`);
    if (!response.ok) {
      console.error('Failed to fetch subjects', response.status, response.statusText);
      return getStoredSubjects(); // Fallback to local storage
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return getStoredSubjects(); // Fallback to local storage
  }
};

export const addSubject = async (subject: SubjectInfo): Promise<SubjectInfo> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('Backend not available, storing locally');
      const subjects = getStoredSubjects();
      const newSubjects = [...subjects, subject];
      storeSubjects(newSubjects);
      return subject;
    }
    
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subject),
    });
    
    if (!response.ok) {
      console.error('Failed to add subject', response.status, response.statusText);
      // Fallback to local storage
      const subjects = getStoredSubjects();
      const newSubjects = [...subjects, subject];
      storeSubjects(newSubjects);
      return subject;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error adding subject:', error);
    // Fallback to local storage
    const subjects = getStoredSubjects();
    const newSubjects = [...subjects, subject];
    storeSubjects(newSubjects);
    return subject;
  }
};

export const removeSubject = async (subjectId: string): Promise<void> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('Backend not available, removing from local storage');
      const subjects = getStoredSubjects();
      const filteredSubjects = subjects.filter(s => s.id !== subjectId);
      storeSubjects(filteredSubjects);
      return;
    }
    
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      // Fallback to local storage
      const subjects = getStoredSubjects();
      const filteredSubjects = subjects.filter(s => s.id !== subjectId);
      storeSubjects(filteredSubjects);
      return;
    }
  } catch (error) {
    console.error('Error removing subject:', error);
    // Fallback to local storage
    const subjects = getStoredSubjects();
    const filteredSubjects = subjects.filter(s => s.id !== subjectId);
    storeSubjects(filteredSubjects);
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
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      // Generate a simple study plan locally
      const sessions: StudySession[] = [];
      let currentDate = new Date(startDate);
      const endDateTime = new Date(endDate);
      
      subjects.forEach(subject => {
        subject.chapters.forEach(chapter => {
          if (currentDate <= endDateTime) {
            sessions.push({
              id: Math.random().toString(36).substring(2, 9),
              user_id: 'local-user',
              subject_id: subject.id,
              title: chapter.name,
              scheduled_date: currentDate.toISOString().split('T')[0],
              scheduled_time: '09:00',
              duration: chapter.estimatedHours,
              completed: false,
              created_at: new Date().toISOString()
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
      });
      
      return {
        sessions,
        startDate,
        endDate
      };
    }
    
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
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      // For now, just return the session with updates applied
      const mockSession: StudySession = {
        id: sessionId,
        user_id: 'local-user',
        subject_id: '',
        title: '',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: '09:00',
        duration: 1,
        completed: false,
        created_at: new Date().toISOString(),
        ...updates
      };
      return mockSession;
    }
    
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
  } catch (error) {
    console.error('Error updating study session:', error);
    throw error;
  }
};
