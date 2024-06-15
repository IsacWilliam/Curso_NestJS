import { Controller, Post, Body, Get, Put, Patch, Delete, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-user-dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
@Roles(Role.ADMIN)
@UseInterceptors(LogInterceptor) // Aplica o interceptador para todas as rotas do controller
@UseGuards(AuthGuard, RoleGuard) // A ordem dos Guards é importante
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService){}

    //@UseInterceptors(LogInterceptor) // Aplica o interceptador apenas para uma rota do controller
    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Get()
    async list(){
        return this.userService.list();
    }

    @Get(':id')
    async show(@ParamId() id: number) {  // @Param utilizando Pipe de transformação de String para Number
        console.log('ParamId: ', {id});
        return this.userService.show(id);
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data);
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.userService.delete(id);
    }
}
