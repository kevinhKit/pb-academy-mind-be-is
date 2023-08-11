import { IsOptional, IsString } from 'class-validator';
import { Question } from 'src/question/entities/question.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';

export class CreateTeacherEvaluationDto {
  @IsOptional()
  @IsString({ message: 'La respuesta debe ser tipo texto' })
  answer: string;

  @IsOptional()
  @IsString({ message: 'La respuesta debe ser tipo texto' })
  openAnswer: string;

  @IsString({ message: 'La matricula debe ser tipo texto' })
  tuitionId: Tuition;

  @IsString({ message: 'La pregunta debe ser tipo texto' })
  questionId: Question;
}
