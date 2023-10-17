export namespace IMicroService{
    export interface Response{
        statusCode: number,
        message: unknown,
        error: unknown
    }

    export interface Conn{
        host: string
        port: number
        pattern: unknown
    }
}