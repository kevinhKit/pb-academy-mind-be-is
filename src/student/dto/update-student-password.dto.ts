import { IsString } from 'class-validator';

export class UpdateStudentPasswordDto {
  @IsString({ message: 'El numero de cuenta debe ser de tipo texto.' })
  accountNumber: string;
}
