import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class UsersBodyDto {
  id: string;
  createdAt?: string;

  /**
   * Esta es la propiedad de nombre
   * @example: "Bartolomiau"
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
