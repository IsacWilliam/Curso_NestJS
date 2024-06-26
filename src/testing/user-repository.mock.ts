import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { userEntityList } from './user-entity-list.mock';

export const usersRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  useValue: {
    exist: jest.fn().mockReturnValue(true),
    create: jest.fn().mockReturnValue(userEntityList[0]),
    save: jest.fn().mockResolvedValue(userEntityList[0]),
    find: jest.fn().mockResolvedValue(userEntityList),
    findOneBy: jest.fn().mockResolvedValue(userEntityList[0]),
    update: jest.fn().mockResolvedValue({ affected: 1 }), // Indica que uma linha foi atualizada
    delete: jest.fn().mockResolvedValue({ affected: 1 }), // Indica que uma linha foi deletada
  },
};
