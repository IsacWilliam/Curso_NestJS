import { Role } from '../enums/role.enum';
import { UpdatePutUserDTO } from '../user/dto/update-user-dto';

export const updatePutUserDTO: UpdatePutUserDTO = {
  birthAt: '2000-01-01',
  email: 'iuri@teste.com',
  name: 'Iuri Victor',
  password: '123456',
  role: Role.USER,
};
