import { IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  accountNumber: string;
  @IsString()
  password: string;
  @IsString()
  employeeNumber: string;
}
