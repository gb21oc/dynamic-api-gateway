import { Request, Response, Router } from "express";

/* const gateway: Router = Router()
const service = new Service()
const repository = new DynamicRouteRepository()

setTimeout(async () => {
    const data = await repository.findAll()
    const routes: any[] = data.map(v => JSON.parse(v.json))
    for(const v of routes){
        const route = Object.keys(v)[0]
        const { method, host, port, pattern, existsQueryParametersInURL, isBody, existsParametersInURL, queryParameters} = v[route]
        const methodFormated: MyExpress.Method = (method as string).trim().toLowerCase() as MyExpress.Method
        console.log(route + " => " + methodFormated)
        gateway[methodFormated](`/${route}`, async (req: Request, res: Response) => {
            let payload;
            if(methodFormated === "get" && Boolean(existsParametersInURL)){
                const options: INestMicroservice.GetQueryOrParam = {
                    req: req,
                    existsParametersInURL: existsParametersInURL,
                    existsQueryParametersInURL: existsQueryParametersInURL,
                    queryParameters: queryParameters
                }
                payload = service.getQueryOrParam(options)
            }else if(Boolean(isBody)) payload = req.body
            const response = await service.sendPayloadToMicroService({
                host: host,
                port: port,
                pattern: pattern,
                payload: payload,
                res: res
            })
            return res.status(response.statusCode).send(response)
        })
    }
}, 60000)

module.exports = gateway; */
