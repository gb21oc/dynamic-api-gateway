import { AppDataSource } from "../../config/typeORM.config";
import { RouteEntity } from "../../entity/route.entity";
import { RouteEntityDTO } from "../../routes/create-routes/DTO/body.DTO";

export class RouteRepository{
    private readonly repository = AppDataSource.getRepository(RouteEntity)

    async findAll(){
        return await this.repository.find()
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
}