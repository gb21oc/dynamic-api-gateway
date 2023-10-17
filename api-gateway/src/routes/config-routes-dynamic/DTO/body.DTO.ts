import { IsDefined, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, Max, Min, Validate, ValidateNested } from "class-validator";
import { IConfigRoutesDynamic } from "../../../common/interface/routes/configRoutesDynamic.interface";
import { Type } from "class-transformer";
import { ValidateFieldsIsNotEmpty } from "../../../common/helpers/pipe/validateFieldIsNotEmpty.pipe";

export class MicroServiceDTO{
    
    @Validate(ValidateFieldsIsNotEmpty, {
        message: "host is not empty!"
    })
    @IsString()
    @IsNotEmpty()
    host: string

    @Min(1)
    @Max(65535)
    @IsNumber()
    @IsNotEmpty()
    port: number

    
    @Validate(ValidateFieldsIsNotEmpty, {
        message: "pattern is not empty!"
    })
    @IsString()
    @IsNotEmpty()
    pattern: string

    /**
     *
     */
    constructor(payload?: Partial<MicroServiceDTO>) {
        Object.assign(this, payload)
        
    }
}

export class RouteEntityDTO implements IConfigRoutesDynamic.OmitIDRouteEntity{

    @Validate(ValidateFieldsIsNotEmpty, {
        message: "path is not empty!"
    })
    @IsString()
    @IsNotEmpty()
    path: string;

    @IsNotEmpty()
    @IsEnum(IConfigRoutesDynamic.METHOD)
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

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
    queryParameters?: object;

    @IsObject()
    @IsOptional()
    parameters?: object;

    @IsEnum(IConfigRoutesDynamic.Body)
    @IsNotEmpty()
    isBody: "0" | "1";
    /**
     *
     */
    constructor(payload?: Partial<RouteEntityDTO>) {
        Object.assign(this, payload)
        
    }
}