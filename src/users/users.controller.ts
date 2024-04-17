import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Res,
  Req,
  Param,
  Query,
  Body,
  Headers,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  NotFoundException,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { DateAdderInterceptor } from '../interceptors/date-adder.interceptor';
import { Request, Response } from 'express';
import { UsersDbService } from './users-db.service';
import { UsersBodyDto } from './users.dto';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export interface User {}

@ApiTags('users')
@Controller('users')
// @UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private userService: UsersService,
    private readonly usersDbService: UsersDbService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
  ) {}

  @Get('auth0/protected')
  getAuth0(@Req() request: any) {
    return JSON.stringify(request.oidc.user);
  }

  @Get('admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAdmin() {
    return 'Ruta protegida';
  }

  @Get()
  getUsers(@Query('name') name: string) {
    if (name) {
      return this.userService.getByName(name);
    }

    return this.userService.getUsers();
  }

  @Get('profile')
  getProfile(@Headers('token') token: string) {
    if (!token) return 'Token is missing';
    if (token !== '1234') return 'Invalid token';

    return 'Perfil del usuario';
  }

  @ApiBearerAuth()
  @Get('profile/images')
  @UseGuards(AuthGuard)
  getProfilePics() {
    return 'DEvuelve las imagenes de perfil';
  }

  @Post('profile/images')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfilePic(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000,
            message: 'El archivo debe ser de maximo 100Kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadImage(file);
  }

  @Post('signin')
  async signIn(@Body() user: any) {
    const { password, email } = user;
    return this.authService.signIn(email, password);
  }

  @HttpCode(418)
  @Get('coffee')
  getCoffee() {
    return 'No hago cafe soy una tetera';
  }

  @Get('message')
  getMessage(@Res() response: Response) {
    response.status(200).send('Este es el mensaje');
  }

  @Get('request')
  getRequest(@Req() request: Request) {
    console.log(request);

    return 'Esta es la request';
  }

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  createUser(
    @Body() user: UsersBodyDto,
    @Req() request: Request & { now: string },
  ) {
    const modifiedUser = { ...user, createdAt: request.now };

    return this.authService.signUp(modifiedUser);
  }

  @Put()
  update() {
    return 'Actualiza usuario';
  }

  @Delete()
  delete() {
    try {
      throw new Error();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.I_AM_A_TEAPOT,
          error: 'Envio de café fallido',
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }

  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersDbService.getUserById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
