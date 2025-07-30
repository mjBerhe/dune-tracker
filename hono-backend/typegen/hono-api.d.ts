import * as hono_hono_base from 'hono/hono-base';

declare const app: hono_hono_base.HonoBase<{}, {
    "*": {};
} & {
    "/": {
        $get: any;
    };
} & {
    "/create-game": {
        $post: any;
    };
}, "/">;
type AppType = typeof app;

export { app as default };
export type { AppType };
