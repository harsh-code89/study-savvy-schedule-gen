
export interface SubjectInfo {
  id: string;
  name: string;
  difficulty: number; // 1-5
  chapters: ChapterInfo[];
  examDate: Date | null;
  color: string;
}

export interface ChapterInfo {
  id: string;
  name: string;
  subjectId: string;
  difficulty: number; // 1-5
  estimatedHours: number;
  completed: boolean;
}

export interface AvailableTime {
  day: string;
  hours: number;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: number; // in hours
  completed: boolean;
  created_at: string;
}

export interface StudyPlan {
  sessions: StudySession[];
  startDate: Date;
  endDate: Date;
}

export interface UserPreferences {
  breaksEnabled: boolean;
  breakDuration: number; // in minutes
  preferredStudyTime: "morning" | "afternoon" | "evening" | "any";
}
