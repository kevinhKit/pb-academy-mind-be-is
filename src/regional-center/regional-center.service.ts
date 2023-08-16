import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegionalCenterDto } from './dto/create-regional-center.dto';
import { UpdateRegionalCenterDto } from './dto/update-regional-center.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionalCenter } from './entities/regional-center.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RegionalCenterService {

  private readonly logger = new Logger('regionalCenterLogger');

  constructor(

    @InjectRepository(RegionalCenter) private regionalCenterRepository: Repository<RegionalCenter>,

  ) {}

  async create({id, name, description}: CreateRegionalCenterDto) {
    try {
      const regionalCenterExists = await this.regionalCenterRepository.findOne({
        where:[
          {id: id },
          {name: name}
        ]
      });

      if(regionalCenterExists){
        throw new ConflictException('El Centro Regional ya existe');
      }

      const regionalCenter = await this.regionalCenterRepository.create({
        id: id.toUpperCase(),
        name: name.toUpperCase(),
        description
      });

      await this.regionalCenterRepository.save(regionalCenter);

      return {
        statusCode: 200,
        message: this.printMessageLog('El Centro Regional se ha creado exitosamente'),
        regionalCenter
      }

    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const allRegionalCenter = await this.regionalCenterRepository.find();

      
      if(allRegionalCenter.length == 0){
        throw new NotFoundException('No se han encontrado centro regionales')
      }

      return {
        statusCode: 200,
        message: this.printMessageLog('Todas los centros regionales han sido obtenidas exitosamente'),
        regioanlCenter: allRegionalCenter
      }


    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOne(id: string) {
    try {
      const AllRegionalCenter = await this.regionalCenterRepository.findOne({
        where: {
          id: id.toUpperCase()
        }
      });

      
      if(!AllRegionalCenter){
        throw new NotFoundException('No se ha encontrado el centro regional')
      }

      return {
        statusCode: 200,
        message: this.printMessageLog('Se ha obtenido el centro regional exitosamete'),
        regionalCenter: AllRegionalCenter
      }


    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateRegionalCenterDto: UpdateRegionalCenterDto) {
    return `This action updates a #${id} regionalCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} regionalCenter`;
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
