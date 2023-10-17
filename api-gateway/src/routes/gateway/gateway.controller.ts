import { Request, Response, Router } from "express";
import { ServiceShared } from "../../common/shared/service.shared";
import { RouteRepository } from "../../common/repository/route.repository";
import { IMyExpress } from "../../common/interface/express.interface";
import { IService } from "../../common/interface/service.interface";
import { IMicroService } from "../../common/interface/microService.interface";

const gateway: Router = Router()
const serviceShared = new ServiceShared()
const repository = new RouteRepository()
let countRoutes: number = 0

setTimeout(async () => {
    const routes = await repository.findAll()
    console.log(countRoutes, routes.length, countRoutes !== routes.length)
    if(countRoutes !== routes.length){
        countRoutes = routes.length
        for(const route of routes){
            const method = route.method.toLowerCase() as IMyExpress.Method
            const nameFunc = `${route.path}_${method}`
            gateway[method](`/${route.path}`, async (req: Request, res: Response) => {
                const microService: IMicroService.Conn = JSON.parse(route.micro_service)
                let payload;
                /* if(method === "get" && (Boolean(route.parameters) || Boolean(route.queryParameters))){
                    const options: IService.GetQueryOrParam = {
                        req: req,
                        queryParameters: JSON.parse(route.queryParameters) ?? {},
                        parameters: JSON.parse(route.parameters) ?? {}
                    }
                    payload = serviceShared.getQueryOrParam(options)
                }else if(route.isBody === "1") payload = req.body */
                const response = await serviceShared.sendPayloadToMicroService({
                    host: microService.host,
                    port: microService.port,
                    pattern: microService.pattern as string,
                    payload: {},
                    res: res
                })
                return res.status(response.statusCode).send(response)
            })
        }
        const stack = gateway.stack as IMyExpress.Layer[]
        serviceShared.viewRoutesCreated(stack, "GatewayController")
        serviceShared.routeDynamic = gateway
    }
}, 60000)

module.exports = gateway;