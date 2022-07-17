import { authRouter } from "./router/auth";
import { createRouter } from "./context";
import { exampleRouter } from "./router/example";
// src/server/router/index.ts
import superjson from "superjson";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
