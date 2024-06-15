import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { usersRepositoryMock } from "../testing/user-repository.mock";

describe('UserService', () => {

    let userService: UserService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                usersRepositoryMock
            ]
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    test('Validar a definção do UserService', () => {
        expect(userService).toBeDefined();
    });
});