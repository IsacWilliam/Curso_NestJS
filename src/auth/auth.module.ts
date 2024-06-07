import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({
        secret: "69}ZR=qSZS%i0N&qln/YnwstD:!GXBtH"
    })]
})

export class AuthModule {

}
