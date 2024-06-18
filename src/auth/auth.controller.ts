import { Body, Controller, Post, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, Req} from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "../guards/auth.guard";
import { User } from "../decorators/user.decorator";
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "../file/file.service";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ){}

    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO) {
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO){
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO){
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO){
        return this.authService.reset(password, token);
    }
    
    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user, @Req() {tokenPayload}){
        return {user, tokenPayload};
    }
    
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user,
        @UploadedFile(new ParseFilePipe({
            validators: [
                //new FileTypeValidator({fileType: 'image/jpeg || image/png'}), // Funciona, mas não é o correto
                
                //new FileTypeValidator({ fileType: 'image/jpeg' }), // O correto é validar...
                //new FileTypeValidator({ fileType: 'image/png' }),  // ...item a item, separadamente ou ainda

                new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }), // utilizar uma Expressão Regular(REGEX)
                new MaxFileSizeValidator({ maxSize: 1024 * 200}) // Validar o tamanho do arquivo
            ]
        })) photo: Express.Multer.File){

        const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.jpeg`);

        try{
            await this.fileService.upload(photo, path);
        }catch (e) {
            throw new BadRequestException(e);
        }

        return {success: true};
    }
    
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]){
        return files;
    }
    
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'photo',
            maxCount: 1
        },
        {
            name: 'documents',
            maxCount: 10
        }
    ]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}){
        return files;
    }
}
