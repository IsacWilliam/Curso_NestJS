import { Role } from "../enums/role.enum";
import { CreateUserDTO } from "../user/dto/create-user.dto";

export const createUserDTO: CreateUserDTO = {
    birthAt: '2000-01-01',
    email: 'iuri@teste.com',
    name: 'Iuri Victor',
    password: '123456',
    role: Role.USER
}
