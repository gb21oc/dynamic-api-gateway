import { Request, Response } from "express"

export namespace IService{
    export type VerbMethods = "GET" | "POST" | "PUT" | "DELETE"

    export interface SendToMicroService{
        host: string
        port: number
        payload: object
        pattern: string
        res: Response
    }

    export interface GetQueryOrParam{
        req: Request
        existsQueryParametersInUrl: boolean,
        existsParametersInUrl: boolean
        queryParameters: object
    }
}