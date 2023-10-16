import { RouteEntity } from "../../src/entity/route.entity";

const mockRouteEntity = {
    path: 'teste',
    method: 'GET',
    micro_service: '{"host":"localhost","port":8081,"pattern":"testNotPayload"}',
    queryParameters: '{}',
    parameters: '{}',
    isBody: '0',
    id: 1
}

export const repositoryMOCK = {
    mockSuccessFindAll: [ mockRouteEntity ] as RouteEntity[],
    
    mockSuccessInsertInDatabase: mockRouteEntity  as RouteEntity
}