import { RouteEntity } from "../../../entity/route.entity";
import { RouteEntityDTO } from "../../../routes/config-routes-dynamic/DTO/body.DTO";

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

    export interface BodyUpdate extends Partial<RouteEntityDTO>{}
}