export type PracticeMistake = {
  id: string;
  topicId: string;
  slug: string;
  questionIndex: number;
  exerciseId: string;
  prompt: string;
  language: string;
  failedAt: string;
  hint?: string;
};

export type LessonNote = {
  topicId: string;
  slug: string;
  text: string;
  updatedAt: string;
};

export type GuideProgressSync = {
  read: Record<string, string[]>;
  practiced: Record<string, string[]>;
  passedByLesson: Record<string, number[]>;
};

export type ClassroomMember = {
  userId: string;
  username: string;
  role: "teacher" | "student";
  joinedAt: string;
};

export type Classroom = {
  id: string;
  code: string;
  name: string;
  teacherId: string;
  members: ClassroomMember[];
  createdAt: string;
};
