export namespace IMyExpress{
    interface RouteStackOmitRoute extends Omit<Layer, "route">{
        method: string
    }
    interface Route{
        path: string
        stack: RouteStackOmitRoute[],
        methods: object[]
    }

    export type Method = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
    export interface Layer{
        handle?: any
        name?: string
        params?: unknown
        path?: unknown
        keys?: unknown
        regexp?: unknown
        route?: Route
    }
}