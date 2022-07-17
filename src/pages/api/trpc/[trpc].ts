import { appRouter } from "../../../server/createRouter";
import { createContext } from "../../../server/context";
// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
