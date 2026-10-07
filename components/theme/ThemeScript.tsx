import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Runs before paint to avoid light flash when dark mode is saved. */
export function ThemeScript() {
  const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}else{document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme="light";}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
