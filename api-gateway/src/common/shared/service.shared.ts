import { IService } from "../interface/service.interface";
import { IMyExpress } from "../interface/express.interface"
import { ClientTCP } from "@nestjs/microservices";
import { validate } from "class-validator";
import { IMicroService } from "../interface/microService.interface";
import { firstValueFrom, timeout } from "rxjs";
import { HandlingException } from "../helpers/handlingException.helper";
import { RouteEntity } from "../../entity/route.entity";

export class ServiceShared{
    private _routesDeleted: string[] = [];
    private readonly handlingExecption = new HandlingException();
    private static _instance: ServiceShared;

    /**
     *
     */
    constructor() {
        if(ServiceShared._instance){
            return ServiceShared._instance
        }
        ServiceShared._instance = this;
    }

    set routesDeleted(path: string){
        this._routesDeleted.push(path)
    }

    get routesDeleted(): string[]{
        return this._routesDeleted
    }

    /* public static getInstance(): ServiceShared
    {
        return ServiceShared._instance;
    } */

    viewRoutesCreated(routes: IMyExpress.Layer[], controller: string){
        routes.forEach((v: IMyExpress.Layer) => {
            const route = v.route
            if(route){
                const path = route.path
                route.stack.forEach(s => {
                    if(s.method) this.consoleLogColor(undefined, path, s.method, controller)
                })
            }
        })
    }

    verifyUpdateInRoutes(routesInDb: RouteEntity[]){
        const min = 1
        const myDate = new Date()
        const routesNotUpdateInGateway = routesInDb.map(v => {
            if(v.updateAT){
                const [dateRoute, timeRoute] = v.updateAT.split(', ');
                const [day, month, year] = dateRoute.split('/');
                const [hours, minutes, seconds] = timeRoute.split(':');
                const dateRouteParse = new Date(Number(year), (Number(month) - 1), Number(day), Number(hours), Number(minutes), Number(seconds));
                myDate.setMinutes(myDate.getMinutes() - min)
                const diff = myDate.getTime() - dateRouteParse.getTime()
                if(Math.round(diff / 60000) <= 5){
                    return v
                }
            }
        }).filter(Boolean)
        return routesNotUpdateInGateway
    }

    consoleLogColor(text?: string, path?: string, method?: string, controller?: string){
        const date = new Date()
        const hours = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        if(path && method){
            console.log(`\x1b[32m[Express] ${process.pid}\x1b[0m  - ${date.toLocaleDateString()}, ${hours}    \x1b[32m[LOG]\x1b[0m \x1b[33m[RouterExplorer]\x1b[0m \x1b[32mMapped {${controller}, ${path}, ${method.toUpperCase()}} route\x1b[0m \x1b[33m+1ms\x1b[0m`)
        }else if(text){
            console.log(`\x1b[32m[Express] ${process.pid}\x1b[0m  - ${date.toLocaleDateString()}, ${hours}    \x1b[32m[LOG]\x1b[0m \x1b[32m${text}\x1b[0m \x1b[33m+1ms\x1b[0m`)
        }
    }

    getQueryOrParam(options: IService.GetQueryOrParam){
        let query;
        let param;
        /* const keysQuery = options.existsQueryParametersInUrl && options.queryParameters? Object.keys(options.queryParameters): undefined
        if(options.existsQueryParametersInUrl && keysQuery && keysQuery.length > 0){ // * Melhorar essa validação
            query = JSON.parse(Object.keys(options.req.query).reduce((acc, cur) => {
                const key = cur.toString().trim()
                if(keysQuery.includes(key)) {
                    acc += `"${key}": "${options.req.query[key] || ""}", `   
                }
                return acc
            }, '{').slice(0, -2) + "}") 
        }else if(options.existsParametersInUrl){
            param = JSON.parse(Object.keys(options.req.params).reduce((acc, cur) => {
                acc += `"${cur.toString().trim()}": "${options.req.params[cur.toString().trim()] || ""}", `
                return acc
            }, '{').slice(0, -2) + "}")
        } */
        return query || param
    }

    /**
     * Realiza o envio para o micro-serviço
     * @param options configuração do micro-serviço
     * @returns 
     */
    async sendPayloadToMicroService(options: IService.SendToMicroService): Promise<IMicroService.Response>{
        try{
            const client = new ClientTCP({
                host: options.host,
                port: options.port
            })
            await client.connect()
            return await firstValueFrom(client.send(options.pattern, options.payload).pipe(timeout({each: 30000}))) as IMicroService.Response
        }catch(e){
            return this.handlingExecption.validateExecptionMicroService(e as Error, options.res)
        }
    }

    async validatePayloadDTO(dto: object){
        const validatePayload = await validate(dto)
        const validateDTO = validatePayload.map(v => {
            const constraints  = v.constraints
            if(constraints){
                return {
                    property: v.property,
                    errors: Object.values(constraints)
                }
            }
        })
        if(validateDTO.length > 0){
            return {
                statusCode: 400,
                message: "",
                error: validateDTO
            } as IMicroService.Response
        }
    }
}
