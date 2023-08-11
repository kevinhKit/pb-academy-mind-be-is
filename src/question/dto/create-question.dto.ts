import { IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString({ message: 'La pregunta debe ser tipo texto' })
  question: string;
}
