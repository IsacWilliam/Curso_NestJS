import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { usersRepositoryMock } from "../testing/user-repository.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { createUserDTO } from "../testing/create-user-dto.mock";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { updatePutUserDTO } from "../testing/update-put-user-dto.mock";
import { updatePacthUserDTO } from "../testing/update-patch-user-dto.mock";

describe('UserService', () => {

    let userService: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                usersRepositoryMock
            ]
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(UserEntity));
    });

    test('Validar as definções', () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe('Create', () => {
        test('method create', async () => {
            
            jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);

            const result = await userService.create(createUserDTO);

           expect(result).toEqual(userEntityList[0]);
        });
    });

    describe('Read', () => {
        test('method list', async () => {
            
            const result = await userService.list();
 
            expect(result).toEqual(userEntityList);
        });

        test('method show', async () => {
            
            const result = await userService.show(1);
 
            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe('Update', () => {
        test('method update', async () => {
            
            const result = await userService.update(1, updatePutUserDTO);
 
            expect(result).toEqual(userEntityList[0]);
        });

        test('method updatePartial', async () => {
            
            const result = await userService.updatePartial(1, updatePacthUserDTO);
 
            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe('Delete', () => {
        test('method delete', async () => {
            
            const result = await userService.delete(1);
 
            expect(result).toEqual(true);
        });
    });
});