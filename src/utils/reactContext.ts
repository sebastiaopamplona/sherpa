import { createContext } from "react"

type journdevContext = {
  theme: string
  setTheme: (theme: string) => void
}

// TODO(SP) enhance to AppContext, and make it a small object
export const JourndevContext = createContext<journdevContext>({
  theme: "",
  setTheme: () => {},
})
