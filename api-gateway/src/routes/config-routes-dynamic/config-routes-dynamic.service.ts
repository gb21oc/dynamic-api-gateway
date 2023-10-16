import { Router } from "express";
import { ServiceShared } from "../../common/shared/service.shared";
import { IMyExpress } from "../../common/interface/express.interface";
import { IMicroService } from "../../common/interface/microService.interface";
import { RouteRepository } from "../../common/repository/route.repository";
import { MicroServiceDTO, RouteEntityDTO } from "./DTO/body.DTO";
import { ValidationPipe } from "@nestjs/common";

export class ConfigRoutesDynamicService{
    private readonly repository = new RouteRepository()
    private readonly serviceShared = new ServiceShared()

    setRoutesInTerminalLog(router: Router){
        const stack = router.stack as IMyExpress.Layer[]
        this.serviceShared.viewRoutesCreated(stack)
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
            return {
                statusCode: 500,
                message: null,
                error: "Internal Server Error"
            } as IMicroService.Response
        }
    }

    async getById(id: string): Promise<IMicroService.Response>{
        if(isNaN(Number(id))){
            return {
                statusCode: 400,
                message: "Id is number!",
                error: null
            }
        }
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
        const bodyValidate = await this.serviceShared.validatePayloadDTO(bodyDTO)
        const fieldMicroService = await this.serviceShared.validatePayloadDTO(new MicroServiceDTO(bodyDTO.micro_service))
        if(bodyValidate || fieldMicroService) return bodyValidate as IMicroService.Response ?? fieldMicroService as IMicroService.Response
        const isCreated = await this.repository.insert(bodyDTO)
        if(isCreated && Object.keys(isCreated).length > 0){
            return {
                statusCode: 201,
                message: "OK",
                error: null
            }
        }
        return {
            statusCode: 400,
            message: "Route not created",
            error: null
        }
    }
}