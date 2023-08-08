import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateStudentDto extends PartialType(PickType(CreateUserDto, ['dni','firstName','secondName','firstLastName', 'secondLastName', 'email', 'address', 'phone', 'description'])) {
  
  @IsString({ message: 'La carrera debe ser tipo texto.' })
  @IsNotEmpty({message:"No envió o dejo vacio el campo Carrera."})
  career: string;
  
  // @IsNumberString({},{ message: 'La nota de ingreso debe ser de tipo número.' })
  // @IsNotEmpty({message:"No envió o dejo vacia la nota de ingreso."})
  // @IsOptional()
  // incomeNote: string;

  @IsString({ message: 'EL centro regional debe ser de tipo texto.' })
  @IsNotEmpty({message:"No envió o dejo vacio el centro regional."})
  regionalCenter: string;

}
