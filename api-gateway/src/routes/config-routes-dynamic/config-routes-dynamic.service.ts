import { Router } from "express";
import { ServiceShared } from "../../common/shared/service.shared";
import { IMyExpress } from "../../common/interface/express.interface";
import { IMicroService } from "../../common/interface/microService.interface";
import { RouteRepository } from "../../common/repository/route.repository";
import { MicroServiceDTO, RouteEntityDTO } from "./DTO/body.DTO";
import { IConfigRoutesDynamic } from "../../common/interface/routes/configRoutesDynamic.interface";
import { IService } from "../../common/interface/service.interface";
import { RouteEntity } from "../../entity/route.entity";
export class ConfigRoutesDynamicService{
    private readonly repository = new RouteRepository()
    private readonly serviceShared = new ServiceShared()
    private readonly responseJSON = {
        successCreated:  {
            statusCode: 201,
            message: "OK",
            error: null
        },
        successExecution: {
            statusCode: 200,
            message: "OK!",
            error: null
        },
        errorIdIsNumber: {
            statusCode: 400,
            message: null,
            error: "Id is number!"
        },
        errorInternalServerError: {
            statusCode: 500,
            message: null,
            error: "Internal Server Error"
        },
        errorRouteAlreadyCreated: {
            statusCode: 400,
            message: null,
            error: "Route already created"
        },
        errorRouteCreated: {
            statusCode: 400,
            message: null,
            error: "Route not created"
        },
        errorRouteNotFound: {
            statusCode: 400,
            message: null,
            error: "Route not found"
        }
        
    }

    private async createNewRoute(body: RouteEntityDTO): Promise<IMicroService.Response | undefined>{
        const isCreated = await this.repository.insert(body)
        if(isCreated && Object.keys(isCreated).length > 0){
            return this.responseJSON.successCreated
        }
    }

    private validateLogicCreateRoute(body: RouteEntityDTO): IService.Errors | undefined{
        if(body.isBody === "1" && (body.method === "DELETE" || body.method === "GET")){
           return {
                    property: "isBody",
                    errors: [
                        "isBody it is not possible to use body for 'DELETE' and 'GET' methods"
                    ]
                }
        }
    }

    setRoutesInTerminalLog(router: Router){
        const stack = router.stack as IMyExpress.Layer[]
        this.serviceShared.viewRoutesCreated(stack, "ConfigRoutesDynamicController")
    }

    async validateBody(body: RouteEntityDTO): Promise<IMicroService.Response | undefined>{
        const bodyValidate = await this.serviceShared.validatePayloadDTO(body)
        const fieldMicroService = await this.serviceShared.validatePayloadDTO(new MicroServiceDTO(body.micro_service))
        if(bodyValidate || fieldMicroService) return bodyValidate as IMicroService.Response ?? fieldMicroService as IMicroService.Response
    }
    
    async getAll(){
        try{
            const data = await this.repository.findAll()
            const hateoas = data.map(v => {
                const domain = `http://${process.env.HOST}:${process.env.PORT}/dynamic-config/` 
                return {
                    path: v.path,
                    route: `${domain}${v.id}`
                } // * Using Hateoas
            })
            const json = {
                statusCode: data.length > 0? 200: 404,
                message: hateoas,
                error: null
            } as IMicroService.Response
            return json
        }catch(e){
            return this.responseJSON.errorInternalServerError
        }
    }

    async getById(id: string): Promise<IMicroService.Response>{
        if(isNaN(Number(id))) return this.responseJSON.errorIdIsNumber
        const data = await this.repository.findById(Number(id))
        const json = {
            statusCode: data.length > 0? 200: 404,
            message: data,
            error: null
        }
        return json
    }

    async createRoute(body: object): Promise<IMicroService.Response>{
        const bodyDTO = new RouteEntityDTO(body)
        const bodyValidate = await this.validateBody(bodyDTO)
        const method = bodyDTO.method as IConfigRoutesDynamic.METHOD
        const validateBodyAndMethod = this.validateLogicCreateRoute(bodyDTO)
        const isExistsRoute = await this.repository.findByPathAndMethodLikeMicroService(bodyDTO.path, method, bodyDTO.micro_service.pattern)
        if(bodyValidate || isExistsRoute.length > 0){
            return bodyValidate ?? this.responseJSON.errorRouteAlreadyCreated
        }
        else if(validateBodyAndMethod) return {
            statusCode: 400,
            message: "",
            error: validateBodyAndMethod
        } 
        const isCreated = await this.createNewRoute(bodyDTO)
        return isCreated ?? this.responseJSON.errorRouteCreated
    }

    async deleteRoute(id: string): Promise<IMicroService.Response>{
        if(isNaN(Number(id))) return this.responseJSON.errorIdIsNumber
        const data = await this.repository.findById(Number(id))
        if(data.length == 1){
            const isDeleted = await this.repository.deleteById(Number(id))
            if(isDeleted.affected === 1){
                this.serviceShared.routesDeleted = data[0].path
                return {
                    statusCode: 200,
                    message: "The route will be deleted in 5 minutes",
                    error: null
                }
            }
            return {
                statusCode: 400,
                message: null,
                error: "Unable to delete route"
            }
        }
        return this.responseJSON.errorRouteNotFound
    }

    async updateRoute(id: string, payload: Partial<RouteEntity>): Promise<IMicroService.Response>{
        const existsItemBeforeUpdate = await this.repository.findByLike(payload)
        if(isNaN(Number(id))) return this.responseJSON.errorIdIsNumber
        else if(existsItemBeforeUpdate.length > 0){
            return {
                statusCode: 400,
                message: null,
                error: "A route with similar data already exists."
            }   
        }
        if(payload?.micro_service) payload.micro_service = JSON.stringify(payload.micro_service)
        const actualData = await this.repository.findById(Number(id))
        if(actualData.length === 0) return this.responseJSON.errorRouteNotFound
        payload.updateAT = new Date().toLocaleString()
        const newActualData = Object.assign(actualData[0], payload)
        if(actualData.length === 1 && Object.keys(payload).length > 0 && Object.keys(newActualData).length === 8){
            const isUpdate = await this.repository.updateById(Number(id), newActualData)
            return isUpdate? this.responseJSON.successExecution: {
                statusCode: 400,
                message: null,
                error: "Unable to update route"  
            }
        }
        return {
            statusCode: 400,
            message: null,
            error: actualData.length === 0? "Route not found": "It is necessary to inform the data to be updated"
        }
    }
}