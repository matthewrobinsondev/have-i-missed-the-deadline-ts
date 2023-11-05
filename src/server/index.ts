import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    getTasks: publicProcedure.query(() => {
        return [
            { id: 1, text: 'Buy milk', done: false },
            { id: 2, text: 'Buy eggs', done: true },
        ];
    })
});

export type AppRouter = typeof appRouter;