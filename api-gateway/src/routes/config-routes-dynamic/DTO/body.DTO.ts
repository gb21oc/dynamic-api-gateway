import { IsDefined, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { IConfigRoutesDynamic } from "../../../common/interface/routes/configRoutesDynamic.interface";
import { Transform, Type } from "class-transformer";

export class MicroServiceDTO{
    @IsString()
    @IsNotEmpty()
    @Transform(v => {
        return v.value.toString().trim()
    })
    host: string

    @IsNumber()
    @IsNotEmpty()
    port: number

    @IsString()
    @IsNotEmpty()
    @Transform(v => {
        return v.value.toString().trim().toLowerCase()
    })
    pattern: string

    /**
     *
     */
    constructor(payload?: Partial<MicroServiceDTO>) {
        Object.assign(this, payload)
        
    }
}

export class RouteEntityDTO implements IConfigRoutesDynamic.OmitIDRouteEntity{
    @IsString()
    @IsNotEmpty()
    @Transform(v => {
        return v.value.toString().trim().toLowerCase()
    })
    path: string;

    @IsNotEmpty()
    @IsEnum(IConfigRoutesDynamic.METHOD)
    method: IConfigRoutesDynamic.METHOD;

    @IsDefined()
    @IsObject({
        each: true
    })
    @IsNotEmptyObject()
    @ValidateNested({ each: true })
    @Type(() => MicroServiceDTO)
    micro_service: MicroServiceDTO;

    @IsObject()
    @IsOptional()
    queryParameters: object;

    @IsObject()
    @IsOptional()
    parameters: object;

    @IsEnum(IConfigRoutesDynamic.Body)
    @IsNotEmpty()
    isBody: IConfigRoutesDynamic.Body;

    /**
     *
     */
    constructor(payload?: Partial<RouteEntityDTO>) {
        Object.assign(this, payload)
        
    }
}