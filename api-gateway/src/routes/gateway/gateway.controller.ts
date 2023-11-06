import { Request, Response, Router } from "express";
import { ServiceShared } from "../../common/shared/service.shared";
import { RouteRepository } from "../../common/repository/route.repository";
import { IMyExpress } from "../../common/interface/express.interface";
import { IService } from "../../common/interface/service.interface";
import { IMicroService } from "../../common/interface/microService.interface";
import { RouteEntity } from "../../entity/route.entity";

const gateway: Router = Router()
const serviceShared = new ServiceShared()
const repository = new RouteRepository()
let countRoutes: number = 0

function createRoute(routes: RouteEntity[]){
    for(const route of routes){
        const method = route.method.toLowerCase() as IMyExpress.Method
        gateway[method](`/${route.path}`, async (req: Request, res: Response) => {
            const microService: IMicroService.Conn = JSON.parse(route.micro_service)
            let payload;
            // if(method === "get" && (Boolean(route.parameters) || Boolean(route.queryParameters))){
            //     const options: IService.GetQueryOrParam = {
            //         req: req,
            //         queryParameters: JSON.parse(route.queryParameters) ?? {},
            //         parameters: JSON.parse(route.parameters) ?? {}
            //     }
            //     payload = serviceShared.getQueryOrParam(options)
            // }else if(route.isBody === "1") payload = req.body
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
}

async function main(){ // ! Pensar em uma forma de melhorar a exibição das rotas no terminal
    const routes = await repository.findAll()
    const routesUpdate = serviceShared.verifyUpdateInRoutes(routes)
    console.log(countRoutes, routes.length, routesUpdate.length)
    if(countRoutes !== routes.length || routesUpdate.length > 0){ // ! Pensar em uma forma para não ficar entrando aqui em toda executação
        console.log("Aqui")
        countRoutes = routes.length
        createRoute(routes)
    }
    if(serviceShared.routesDeleted.length > 0){
        const newGateway = serviceShared.routesDeleted.map((path, idx) => {
            const newGatewayFilter = gateway.stack.filter((l: IMyExpress.Layer) => l.route?.path !== path)
            serviceShared.routesDeleted.splice(idx, 1)
            console.log(newGatewayFilter)
        })
    }
}

setInterval(async () => {
    await main()
}, 60000)

module.exports = gateway;