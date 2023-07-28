import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CareerService {


  private readonly logger = new Logger('careerLogger');

  constructor(

    @InjectRepository(Career) private careerRepository: Repository<Career>,

  ) {}


  async create({id, name, raceCode}: CreateCareerDto) {
    try {
      const careerExists = await this.careerRepository.findOne({
        where:{
          id
        }
      });

      if(careerExists){
        throw new ConflictException('La Carrera ya existe');
      }

      const career = await this.careerRepository.create({
        id: id.toUpperCase(),
        name: name.toUpperCase(),
        raceCode
      });

      await this.careerRepository.save(career);

      return {
        statusCode: 200,
        message: this.printMessageLog('La Carrera se ha creado exitosamente'),
        career
      }

    } catch (error) {
      return this.printMessageError(error);
    }
  }

  findAll() {
    return `This action returns all career`;
  }

  findOne(id: number) {
    return `This action returns a #${id} career`;
  }

  update(id: number, updateCareerDto: UpdateCareerDto) {
    return `This action updates a #${id} career`;
  }

  remove(id: number) {
    return `This action removes a #${id} career`;
  }

  printMessageLog(message){
    this.logger.log(message);
    return message;
  }

  printMessageError(message){
    if(message.response){

      if(message.response.message){
        this.logger.error(message.response.message);
        return message.response;
      }

      this.logger.error(message.response);
      return message.response;
    }

    this.logger.error(message);
    return message;
  }
}
