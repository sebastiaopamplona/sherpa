import type { AppRouter } from "../server/createRouter";
// src/utils/trpc.ts
import { createReactQueryHooks } from "@trpc/react";

export const trpc = createReactQueryHooks<AppRouter>();

/**
 * Check out tRPC docs for Inference Helpers
 * https://trpc.io/docs/infer-types#inference-helpers
 */
