import { RouteEntity } from "../../../entity/route.entity";

export namespace IConfigRoutesDynamic{
    export type OmitIDRouteEntity = Omit<RouteEntity, "id" | "micro_service" | "queryParameters" | "parameters">

    export enum METHOD {
        GET = "GET",
        POST = "POST",
        DELETE = "DELETE",
        PUT = "PUT",
        PATCH = "PATCH"
    }

    export enum Body{
        notExists = "0",
        exists = "1"
    }
}