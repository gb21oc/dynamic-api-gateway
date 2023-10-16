import { resolve } from "path"
import * as dotenv from "dotenv"

const path = resolve(__dirname, `../../../../.${process.env.NODE_ENV}.env`)
dotenv.config({path: path})

import { DataSource } from 'typeorm';
import { RouteRepository } from '../route.repository';
import { it, describe, beforeAll, afterAll, jest, expect } from '@jest/globals';
import { AppDataSource } from '../../../config/typeORM.config';
import { repositoryMOCK } from "../../../../test/mock/repository.mock";
import { RouteEntityDTO } from "../../../routes/config-routes-dynamic/DTO/body.DTO";


describe("Route Repository", () => {
    let dataSource: DataSource;
    const routeRepository = new RouteRepository()

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize()
        console.log(`[+] Database is initialize: ${dataSource.isInitialized}`) 
    })

    describe("Route Repository", () => {
        it("should return success object after insert dada in database", async () => {
            const sypOnInsert = jest.spyOn(RouteRepository.prototype, "insert").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessInsertInDatabase))
            const payload: RouteEntityDTO = {
                path: "teste",
                method: "GET",
                micro_service: {
                    host: "localhost",
                    port: 8081,
                    pattern: "testNotPayload"
                },
                isBody: "0"
            }
            const isInserted = await routeRepository.insert(payload)
            expect(Object.keys(isInserted).length > 0).toBe(true)
            sypOnInsert.mockClear()
            sypOnInsert.mockRestore()
        })

        it("should return the data entered into the database", async () => {
            const sypOnFindAll = jest.spyOn(RouteRepository.prototype, "findAll").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessFindAll))
            const data = await routeRepository.findAll()
            expect(data.length > 0).toBe(true)
            sypOnFindAll.mockClear()
            sypOnFindAll.mockRestore()
        })
    })

    afterAll(async () => {
        await dataSource.destroy()
    })
})
