import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "route"
})
export class RouteEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 200
    })
    path: string

    @Column({
        enum: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        type: "enum"
    })
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH"

    @Column({
        length: 500
    })
    micro_service: string

    @Column({
        length: 800
    })
    queryParameters: string

    @Column({
        length: 800
    })
    parameters: string

    @Column({
        enum: ["0", "1"],
        default: "0",
        type: "enum"
    })
    isBody: "0" | "1"
}