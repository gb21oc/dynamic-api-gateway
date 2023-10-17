import { Response } from "express"
import { IMicroService } from "../interface/microService.interface"

export class HandlingException {
    validateExecptionMicroService(e: Error, res: Response) {
        try {
            if (e.message.toString().includes("ENOTFOUND")) {
                return {
                    statusCode: 422,
                    message: "",
                    error: "Não foi possível concluir a solicitação, conexão não encontrada!"
                }
            }
            else if (e.message.toString().includes('ECONNREFUSED')) {
                return {
                    statusCode: 503,
                    message: "",
                    error: 'Não foi possível concluir a solicitação, conexão recusada, tente novamente ou mais tarde!'
                }
            }
            else if (e.message.toString().includes('Timeout')) {
                return {
                    statusCode: 408,
                    message: "",
                    error: `Não é possível concluir a solicitação, ocorreu tempo limite`
                }
            }
            else if (e.hasOwnProperty("message") && e.hasOwnProperty("statusCode") && e.hasOwnProperty("error") && Object.keys(e).length === 3) {
                const jsonError: unknown = e
                return jsonError as IMicroService.Response
            }
            return {
                statusCode: 500,
                message: "",
                error: 'Não foi possível concluir a solicitação, ocorreu um erro interno, tente novamente!'
            }
        } catch (e) {
            return {
                statusCode: 500,
                message: "",
                error: 'Ocorreu um erro interno, tente novamente!'
            }
        }
    }
}