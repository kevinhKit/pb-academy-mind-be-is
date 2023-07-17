import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateStudentDto extends PartialType(PickType(CreateUserDto, ['dni','firstName','secondName','firstLastName', 'secondLastName', 'email', 'password', 'address', 'phone', 'description'])) {




  
  @IsString({ message: 'La carrera debe ser tipo texto.' })
  @IsNotEmpty({message:"No envió o dejo vacio el campo Carrera."})
  career: string;
  
  @IsString({ message: 'EL centro regional debe ser de tipo texto.' })
  @IsNotEmpty({message:"No envió o dejo vacio el centro regional."})
  regionalCenter: string;

}
