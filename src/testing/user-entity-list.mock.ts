import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    name: 'Isac Willam',
    email: 'isac@teste.com',
    birthAt: new Date('2000-01-01'),
    id: 1,
    password: '$2b$10$4it.KA5H97aowmpL5he/4eUehPb9G12jNfdw8uBt81IrAhjx928rS',
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Iuri Victor',
    email: 'iuri@teste.com',
    birthAt: new Date('2000-01-01'),
    id: 2,
    password: '$2b$10$4it.KA5H97aowmpL5he/4eUehPb9G12jNfdw8uBt81IrAhjx928rS',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Nina',
    email: 'nina@teste.com',
    birthAt: new Date('2000-01-01'),
    id: 3,
    password: '$2b$10$4it.KA5H97aowmpL5he/4eUehPb9G12jNfdw8uBt81IrAhjx928rS',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
