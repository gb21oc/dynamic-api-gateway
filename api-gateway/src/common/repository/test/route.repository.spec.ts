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
import { RouteEntity } from "../../../entity/route.entity";


describe("Route Repository", () => {
    let dataSource: DataSource;
    const routeRepository = new RouteRepository()
    const repo = AppDataSource.getRepository(RouteEntity)
    const sypOnFindAll = jest.spyOn(repo, "find").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessFindAll))
    const sypOnUpdate = jest.spyOn(repo, "update").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessUpdate))
    const sypOnInsert = jest.spyOn(repo, "save").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessInsertInDatabase))
    const sypOnDelete = jest.spyOn(repo, "delete").mockReturnValue(Promise.resolve(repositoryMOCK.mockSuccessDeleteItem))

    describe("Route Repository", () => {
        it("should return success object after insert dada in database", async () => {
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
        })

        it("should return the data entered into the database", async () => {
            const data = await routeRepository.findAll()
            expect(data.length > 0).toBe(true)
        })

        it("should return success in update item in database", async () => {
            const actual = await routeRepository.findById(Number(8))
            const itemUpdate = Object.assign(actual[0], {
                path: "new-routeee",
            })
            const data = await routeRepository.updateById(8, itemUpdate)
            expect(data?.affected).toBe(1) // { generatedMaps: [], raw: [], affected: 1 }
        })

        it("should return success in delete item in database", async () => {
            const data = await routeRepository.deleteById(8)
            expect(data?.affected).toBe(1)
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