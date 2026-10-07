export type PracticeKind =
  | "introduction"
  | "variables"
  | "operators"
  | "conditionals"
  | "loops"
  | "functions"
  | "collections"
  | "objects"
  | "dictionaries"
  | "error-handling"
  | "classes"
  | "inheritance"
  | "encapsulation"
  | "exceptions"
  | "control-flow";

const SLUG_TO_KIND: Record<string, PracticeKind> = {
  introduction: "introduction",
  "variables-and-types": "variables",
  operators: "operators",
  conditionals: "conditionals",
  "control-flow": "control-flow",
  loops: "loops",
  functions: "functions",
  methods: "functions",
  "lists-and-tuples": "collections",
  arrays: "collections",
  "data-structures": "collections",
  objects: "objects",
  dictionaries: "dictionaries",
  "error-handling": "error-handling",
  "classes-and-objects": "classes",
  inheritance: "inheritance",
  encapsulation: "encapsulation",
  exceptions: "exceptions",
};

export function practiceKind(slug: string): PracticeKind | null {
  return SLUG_TO_KIND[slug] ?? null;
}
