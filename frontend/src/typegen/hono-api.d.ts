import * as hono_hono_base from 'hono/hono-base';
import * as hono_types from 'hono/types';
import { z } from 'zod';

declare const createGameSchema: z.ZodObject<{
    host: z.ZodString;
    maxPlayers: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
type CreateGameInput = z.infer<typeof createGameSchema>;
declare const appRouter: hono_hono_base.HonoBase<hono_types.BlankEnv, hono_types.BlankSchema | hono_types.MergeSchemaPath<{
    "*": {};
} & {
    "/": {
        $get: any;
    };
} & {
    "/create-game": {
        $post: any;
    };
}, "/">, "/">;
type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter, CreateGameInput };
