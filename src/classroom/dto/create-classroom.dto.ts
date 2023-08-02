import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { Building } from 'src/building/entities/building.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

export class CreateClassroomDto {
  @IsNumberString(
    {},
    { message: 'El código del aula debe ser de tipo número.' },
  )
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo código de aula' })
  codeClass: string;

  @IsString({ message: 'El edificio debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo edificio' })
  building: Building;

  @IsString({ message: 'El centro regional debe ser de tipo text' })
  @IsNotEmpty({ message: 'El centro regional es un campo obligatorio' })
  regionalCenterId: RegionalCenter;
}
