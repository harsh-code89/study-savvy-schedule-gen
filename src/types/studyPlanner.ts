
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
  date: Date;
  subjectId: string;
  chapterId: string;
  duration: number; // in hours
  completed: boolean;
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
