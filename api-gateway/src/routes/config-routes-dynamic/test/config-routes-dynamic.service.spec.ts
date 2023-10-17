import { resolve } from "path"
import * as dotenv from "dotenv"

const path = resolve(__dirname, `../../../../.${process.env.NODE_ENV}.env`)
dotenv.config({path: path})

import { it, describe, jest, expect, beforeAll, afterAll } from '@jest/globals';
import { ConfigRoutesDynamicService } from "../config-routes-dynamic.service";
import { repositoryMOCK } from "../../../../test/mock/repository.mock";
import { RouteRepository } from "../../../common/repository/route.repository";
import { RouteEntityDTO } from "../DTO/body.DTO";
import { IMicroService } from "../../../common/interface/microService.interface";
import { configRoutesDynamicServiceMOCK } from "../../../../test/mock/config-routes-dynamic.service.mock";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../../config/typeORM.config";
import { IConfigRoutesDynamic } from "../../../common/interface/routes/configRoutesDynamic.interface";
import { RouteEntity } from "../../../entity/route.entity";

describe("Config Routes Dynamic Service", () => {
    const configRoutesDynamicService = new ConfigRoutesDynamicService()
    const repo = AppDataSource.getRepository(RouteEntity)
    const sypOnFindAll = jest.spyOn(repo, "find").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessFindAll))
    const sypOnUpdate = jest.spyOn(repo, "update").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessUpdate))
    const sypOnInsert = jest.spyOn(repo, "save").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessInsertInDatabase))
    const sypOnDelete = jest.spyOn(repo, "delete").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessDeleteItem))

    describe("validateBody", () => {
        const body = new RouteEntityDTO({
            "path": "new-route",
            "method": "GET",
            "micro_service": {
                "host": "localhost",
                "port": 8081,
                "pattern": "testNotPayload"
            },
            "isBody":  "1"
        })

        it("should return success in validate body", async () => {
            const data = await configRoutesDynamicService.validateBody(body) // * return undefind is body correct
            expect(!data).toBe(true)
        })

        it("should return bad-request becouse field 'path' is empty", async () => {
            body.path = ""
            const data = await configRoutesDynamicService.validateBody(body)
            expect((data as IMicroService.Response).statusCode).toBe(400)
            body.path = "new-route"
        })

        it("should return bad-request beacouse my object 'micro_service' in your field 'host' is empty", async () => {
            body.micro_service.host = ""
            const data = await configRoutesDynamicService.validateBody(body)
            expect((data as IMicroService.Response).statusCode).toBe(400)
            body.micro_service.host = "localhost"
        })
    })

    describe("getAll", () => {
        it("should return all data in database", async () => {
            const data = await configRoutesDynamicService.getAll()
            expect(data.statusCode).toBe(200)
        })

        it("should return empty, status-code is not-found", async () => {
            const sypOnFindAll = jest.spyOn(RouteRepository.prototype, "findAll").mockReturnValue(Promise.resolve([]))
            const data = await configRoutesDynamicService.getAll()
            expect(data.statusCode).toBe(404)
            sypOnFindAll.mockClear()
            sypOnFindAll.mockRestore()
        })
    })

    describe("getById", () => {
        it("should return the object corresponding to the ID", async () => {           
            const data = await configRoutesDynamicService.getById("1")
            expect(data.statusCode).toBe(200)
        })

        it("should return not-found", async () => {
            const sypOnFindById = jest.spyOn(RouteRepository.prototype, "findById").mockReturnValue(Promise.resolve([]))            
            const data = await configRoutesDynamicService.getById("2")
            expect(data.statusCode).toBe(404)
            sypOnFindById.mockClear()
            sypOnFindById.mockRestore()
        })

        it("should return error in field 'id'", async () => {
            const data = await configRoutesDynamicService.getById("a")
            expect(data).toMatchObject(configRoutesDynamicServiceMOCK.errorInValidationID)
        })
    })


    describe("createRoute", () => {
        const body = {
            path: 'new-route',
            method: 'GET' as IConfigRoutesDynamic.METHOD,
            micro_service: {
                "host":"localhost",
                "port":8081,
                "pattern":"testNotPayload"
            },
            isBody: '0' as IConfigRoutesDynamic.Body
        }

        it("should return success in created route", async () => {
            const sypOnInsert = jest.spyOn(RouteRepository.prototype, "insert").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessInsertInDatabase))
            const sypOnLike = jest.spyOn(RouteRepository.prototype, "findByPathAndMethodLikeMicroService").mockReturnValue(Promise.resolve([]))
            const data = await configRoutesDynamicService.createRoute(body)
            expect(data).toMatchObject(configRoutesDynamicServiceMOCK.mockSuccessCreatedRoute)
            sypOnInsert.mockClear()
            sypOnInsert.mockRestore()
            sypOnLike.mockClear()
            sypOnLike.mockRestore()
        })

        it("should return route already created", async () => {
            const data = await configRoutesDynamicService.createRoute(body)
            expect(data).toMatchObject(configRoutesDynamicServiceMOCK.mockRouteAlreadyCreated)
        })

        it("should return bad-request becouse field 'isBody' is '1' and 'method' is 'GET' it is only possible to use body when it is 'POST, PUT, PATCH'", async () => {
            const sypOnLike = jest.spyOn(RouteRepository.prototype, "findByPathAndMethodLikeMicroService").mockReturnValue(Promise.resolve([]))
            body.isBody = "1" as IConfigRoutesDynamic.Body
            const data = await configRoutesDynamicService.createRoute(body)
            expect(data).toMatchObject(configRoutesDynamicServiceMOCK.mockErrorInValidateLogicCreateRoute)
            body.isBody = "0" as IConfigRoutesDynamic.Body
            sypOnLike.mockClear()
            sypOnLike.mockRestore()
        })
    })

    describe("deleteRoute", () => {
        it("should return success in delete item", async () => {
            const data = await configRoutesDynamicService.deleteRoute("8")
            expect(data).toMatchObject(configRoutesDynamicServiceMOCK.mockSuccessDeleteRoute)
        })
    })

    describe("updateRoute", () => {
        it("should return sucess in update item", async () => {
            const data = await configRoutesDynamicService.updateRoute("8", {
                path: "teste"
            })
            expect(data).toMatchObject(configRoutesDynamicServiceMOCK.mockSuccessUpdateItem)
        })
    })

    afterAll(async () => {
        sypOnFindAll.mockClear()
        sypOnFindAll.mockRestore()
        sypOnUpdate.mockClear()
        sypOnUpdate.mockRestore()
        sypOnInsert.mockClear()
        sypOnInsert.mockRestore()
        sypOnDelete.mockClear()
        sypOnDelete.mockRestore()
    })
})