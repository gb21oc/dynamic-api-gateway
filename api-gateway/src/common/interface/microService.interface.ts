export namespace IMicroService{
    export interface Response{
        statusCode: number,
        message: unknown,
        error: unknown
    }
}