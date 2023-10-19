import { Like } from "typeorm";
import { AppDataSource } from "../../config/typeORM.config";
import { RouteEntity } from "../../entity/route.entity";
import { RouteEntityDTO } from "../../routes/config-routes-dynamic/DTO/body.DTO";
import { IConfigRoutesDynamic } from "../interface/routes/configRoutesDynamic.interface";

export class RouteRepository{
    private readonly repository = AppDataSource.getRepository(RouteEntity)

    async findAll(){
        return await this.repository.find()
    }

    async findById(id: number){
        return await this.repository.find({
            where: {
                id: id
            }
        })
    }

    async deleteById(id: number){
        return await this.repository.delete({id: id})
    }

    async findByLike(obj: Partial<RouteEntity>){
        return await this.repository.find({
            where: obj
        })
    }

    async findByPathAndMethodLikeMicroService(path: string, method: IConfigRoutesDynamic.METHOD, ms: string){
        return await this.repository.find({
            where: {
                path: path,
                method: method,
                micro_service: Like(`%${ms}%`)
            }
        })
    }

    async insert(payload: RouteEntityDTO){ // ! Fazer conversao de object para string, basta utilizar JSON.stringify
        const entity = new RouteEntity()
        entity.path = payload.path
        entity.method = payload.method
        entity.micro_service = JSON.stringify(payload?.micro_service? payload?.micro_service: {})
        entity.queryParameters = JSON.stringify(payload?.queryParameters? payload?.queryParameters: {})
        entity.parameters = JSON.stringify(payload?.parameters? payload?.parameters: {})
        entity.isBody = payload.isBody
        return await this.repository.save(entity)
    }

    async updateById(id: number, payload: RouteEntity){
        return await this.repository.update(id, payload)
    }
}