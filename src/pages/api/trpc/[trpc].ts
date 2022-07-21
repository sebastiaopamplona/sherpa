import { appRouter } from "../../../server/createRouter"
import { createContext } from "../../../server/context"
// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next"

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  onError({ error, type, path, input, ctx, req }) {
    console.error("Error:", error)
    if (error.code === "INTERNAL_SERVER_ERROR") {
      // send to bug reporting
    }
  },
})
