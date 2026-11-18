import { LandingPage } from "@/components/landing/LandingPage";
import { getGuideTopic, guidesForTopic } from "@/lib/guides/index";

// Send only the course outline, rather than full lesson content, to the landing UI.
const courses = [
  { id: "python", description: "Foundations of programming with real examples." },
  { id: "javascript", description: "Interactive and dynamic web applications." },
  { id: "typescript", description: "Safer and more maintainable code." },
  { id: "java", description: "Object-oriented programming and applications." },
  { id: "sql", description: "Managing and analyzing databases." },
] as const;

export default function HomePage() {
  return <LandingPage courses={courses.map((course) => ({
    ...course,
    name: getGuideTopic(course.id).name,
    lessonSlugs: [...new Set(guidesForTopic(course.id).map((lesson) => lesson.slug))],
  }))} />;
}
