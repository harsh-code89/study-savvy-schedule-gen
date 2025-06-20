import { SubjectInfo, ChapterInfo, AvailableTime, StudySession, StudyPlan } from "../types/studyPlanner";

// Calculate priority score for a chapter based on exam date proximity and difficulty
function calculatePriority(
  chapter: ChapterInfo,
  subject: SubjectInfo,
  currentDate: Date,
): number {
  if (!subject.examDate) return chapter.difficulty;
  
  const daysUntilExam = Math.max(
    1,
    Math.ceil((subject.examDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24))
  );
  
  // Higher score = higher priority
  // Prioritize by: exam closeness, difficulty, and estimated study time
  const examProximityScore = 100 / daysUntilExam;
  const difficultyScore = chapter.difficulty * 2;
  const timeScore = chapter.estimatedHours;
  
  return examProximityScore + difficultyScore + timeScore;
}

// Get the next available date from the current date based on a list of dates to avoid
function getNextAvailableDate(
  currentDate: Date,
  unavailableDates: Date[],
): Date {
  const newDate = new Date(currentDate);
  
  let dateIsAvailable = false;
  while (!dateIsAvailable) {
    dateIsAvailable = true;
    
    // Check if date is in unavailableDates
    for (const unavailableDate of unavailableDates) {
      if (unavailableDate.toDateString() === newDate.toDateString()) {
        dateIsAvailable = false;
        newDate.setDate(newDate.getDate() + 1);
        break;
      }
    }
  }
  
  return newDate;
}

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Main function to generate study plan
export function generateStudyPlan(
  subjects: SubjectInfo[],
  availableTimes: AvailableTime[],
  startDate: Date,
  endDate: Date
): StudyPlan {
  const sessions: StudySession[] = [];
  const currentDate = new Date(startDate);
  const dayMap: {[key: string]: number} = {
    "Sunday": 0, 
    "Monday": 1, 
    "Tuesday": 2, 
    "Wednesday": 3, 
    "Thursday": 4, 
    "Friday": 5, 
    "Saturday": 6
  };
  
  // Get all chapters and sort them by priority
  const chaptersWithMetadata = subjects.flatMap((subject) => {
    return subject.chapters.map((chapter) => {
      const priority = calculatePriority(chapter, subject, currentDate);
      return { chapter, subject, priority };
    });
  }).sort((a, b) => b.priority - a.priority);
  
  // Keep track of scheduled dates to avoid duplicate dates
  const scheduledDateHours: {[dateString: string]: number} = {};
  
  // Iterate through each chapter and schedule study sessions
  for (const { chapter, subject } of chaptersWithMetadata) {
    let hoursRemaining = chapter.estimatedHours;
    
    while (hoursRemaining > 0) {
      const currentDayOfWeek = currentDate.getDay();
      const currentDayName = Object.keys(dayMap).find(day => dayMap[day] === currentDayOfWeek);
      
      // Find available time for current day
      const dayAvailability = availableTimes.find(time => time.day === currentDayName);
      const hoursAvailableForToday = dayAvailability?.hours || 0;
      
      // If no time available on this day, move to next day
      if (hoursAvailableForToday === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      // Format date string for tracking
      const dateString = currentDate.toDateString();
      
      // Calculate how many hours already scheduled for this date
      const hoursAlreadyScheduled = scheduledDateHours[dateString] || 0;
      
      // Calculate remaining hours for today
      const remainingHoursForToday = Math.max(0, hoursAvailableForToday - hoursAlreadyScheduled);
      
      if (remainingHoursForToday === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      // Calculate how many hours to study
      const hoursToStudy = Math.min(hoursRemaining, remainingHoursForToday);
      
      // Create study session
      const session: StudySession = {
        id: generateId(),
        user_id: 'local-user',
        subject_id: subject.id,
        title: chapter.name,
        scheduled_date: currentDate.toISOString().split('T')[0],
        scheduled_time: '09:00',
        duration: hoursToStudy,
        completed: false,
        created_at: new Date().toISOString()
      };
      
      // Add session
      sessions.push(session);
      
      // Update tracking variables
      hoursRemaining -= hoursToStudy;
      scheduledDateHours[dateString] = (scheduledDateHours[dateString] || 0) + hoursToStudy;
      
      // Move to next day if we've used up today's hours
      if (scheduledDateHours[dateString] >= hoursAvailableForToday) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // If we've reached the end date, break
      if (currentDate > endDate) break;
    }
    
    // If we've reached the end date, break the outer loop as well
    if (currentDate > endDate) break;
  }
  
  return { sessions, startDate, endDate };
}

// Helper function to get a list of color options for subjects
export const subjectColorOptions = [
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#8B5CF6", // Violet
];

// Helper function to get random color from the options
export function getRandomColor(): string {
  return subjectColorOptions[Math.floor(Math.random() * subjectColorOptions.length)];
}

// Function to check if a date is a weekday
export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
}

// Function to convert weekday number to string
export function getWeekdayString(dayNum: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayNum];
}
