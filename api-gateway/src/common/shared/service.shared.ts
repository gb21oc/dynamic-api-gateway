import { IService } from "../interface/service.interface";

export class ServiceShared{
    getQueryOrParam(options: IService.GetQueryOrParam){
        let query;
        let param;
        const keysQuery = options.existsQueryParametersInUrl && options.queryParameters? Object.keys(options.queryParameters): undefined
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
        }
        return query || param
    }

    /**
     * Realiza o envio para o micro-serviço
     * @param options configuração do micro-serviço
     * @returns 
     */
    /* async sendPayloadToMicroService(options: IService.SendoToMicroService): Promise<IMicroService.Response>{
        try{
            const client = new ClientTCP({
                host: options.host,
                port: options.port
            })
            await client.connect()
            if(!options.payload || Object.keys(options.payload).length === 0) return {
                statusCode: 400,
                message: "Bad Request",
                error: ""
            } as IMicroService.Response
            return await firstValueFrom(client.send(options.pattern, options.payload).pipe(timeout({each: 30000}))) as IMicroService.Response
        }catch(e){
            return this.handlingExecption.validateExecptionMicroService(
                {
                    nameClass: Service.name,
                    nameFunction: "sendPayloadToMicroService"
                },
                e as Error,
                options.res
            )
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

    formatedJson(body: CreateRouteDTO){
        //const bodyOmitValue = [body].map(({route, ...json})  => json)
        const queryParameters = body.queryParameters? `${JSON.stringify(body.queryParameters)}`: null
        return `{"${body.route}": {"method": "${body.method}", "host": "${body.host}", "port":"${body.port}", "pattern": "${body.pattern}", "isBody": "${body.isBody}", "existParametersInURL": "${body.existParametersInURL}", "existsQueryParametersInURL": "${body.existsQueryParametersInURL}", "queryParameters": ${queryParameters}}}`
    } */
}