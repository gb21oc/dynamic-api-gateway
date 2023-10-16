import { Request, Response, Router } from "express"
import { ConfigRoutesDynamicService } from "./config-routes-dynamic.service"

const router = Router()
const configRoutesDynamicService = new ConfigRoutesDynamicService()

router.get("/", async (_req: Request, res: Response) => {
    const data = await configRoutesDynamicService.getAll()
    return res.status(data.statusCode).json(data)
})

router.get("/:id", async (req: Request, res: Response) => {
    const data = await configRoutesDynamicService.getById(req.params.id)
    return res.status(data.statusCode).json(data)
})

router.post("/", async (req, res) => {
    const data = await configRoutesDynamicService.createRoute(req.body)
    return res.status(data.statusCode).json(data)
})

configRoutesDynamicService.setRoutesInTerminalLog(router)

export const configDynamicRouter = router