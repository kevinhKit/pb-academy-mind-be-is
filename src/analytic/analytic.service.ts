import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAnalyticDto } from './dto/create-analytic.dto';
import { UpdateAnalyticDto } from './dto/update-analytic.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { Section } from 'src/section/entities/section.entity';
import { Class } from 'src/class/entities/class.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { ExceptionalCancellation } from 'src/exceptional-cancellation/entities/exceptional-cancellation.entity';
import { PeriodController } from 'src/period/period.controller';
import { Period } from 'src/period/entities/period.entity';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';
import { Question } from 'src/question/entities/question.entity';
import { Building } from 'src/building/entities/building.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { Career } from 'src/career/entities/career.entity';
import { CareerChange } from 'src/career-change/entities/career-change.entity';
import { CareerClass } from 'src/career-class/entities/career-class.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';
import { TeacherEvaluation } from 'src/teacher-evaluation/entities/teacher-evaluation.entity';
import { CenterChange } from 'src/center-change/entities/center-change.entity';
import { CriteriaAnalyticDto } from './dto/criteria-analytic.dto';
import { SendEmailService } from 'src/shared/send-email/send-email.service';
import { throws } from 'assert';
import { distinct } from 'rxjs';

@Injectable()
export class AnalyticService {

  private readonly logger = new Logger('analiticLogger');

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Career) private careerRepository: Repository<Career>,
    @InjectRepository(RegionalCenter) private regionalCenterRepository: Repository<RegionalCenter>,
    @InjectRepository(CareerChange) private careerChangeRepository: Repository<CareerChange>,
    @InjectRepository(CenterCareer) private centerCareerRepository: Repository<CenterCareer>,
    @InjectRepository(Building) private buildingRepository: Repository<Building>,
    @InjectRepository(CareerClass) private careerClassRepository: Repository<CareerClass>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Classroom) private classroomRepository: Repository<Classroom>,
    @InjectRepository(ExceptionalCancellation) private exceptionalCancellationRepository: Repository<ExceptionalCancellation>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(Question) private questionRepository: Repository<Question>,
    @InjectRepository(RequirementClass) private requirementClassRepository: Repository<RequirementClass>,
    @InjectRepository(Section) private sectionRepository: Repository<Section>,
    @InjectRepository(StatePeriod) private statePeriodRepository: Repository<StatePeriod>,
    @InjectRepository(StudentCareer) private studentCareerRepository: Repository<StudentCareer>,
    @InjectRepository(TeachingCareer) private teacherCareerRepository: Repository<TeachingCareer>,
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(TeacherEvaluation) private teacherEvaluationRepository: Repository<TeacherEvaluation>,
    @InjectRepository(CenterChange) private centerChangeRepository: Repository<CenterChange>,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async findFilter({idPeriod, idCareer, idRegionalCenter, idClass, failedStudent, approvedStudent}: CriteriaAnalyticDto) {
    try {
      // verificaciones
      const periodExist = await this.periodRepository.findOne({where: { id : idPeriod }});

      if(!periodExist) throw new  NotFoundException('El periodo academico no se ha encontrado');

      const careerExits = await this.careerRepository.findOne({where: { id : idCareer}});

      if(!careerExits) throw new NotFoundException('La carrera no se ha encontrado');

      const regionalCenterExits = await this.regionalCenterRepository.findOne({where: { id : idRegionalCenter}});

      if(!regionalCenterExits) throw new NotFoundException('El centro regional no se ha encontrado')

      // opcionales
      const classExits = await this.classRepository.findOne({where: { id : +idClass}}) ;

      if(!classExits) throw new NotFoundException('La clase no se ha encontrado');

      // filtros
      const analitycs = []

      const allStudent = await this.studentRepository.count({
        where:{
          studentCareer: {
            centerCareer:{
              career: {
                id: idCareer
              },
              regionalCenter:{
                id: idRegionalCenter
              }
            }
          }
        }
      });

      const allStudentEnrolled = await this.studentRepository.count({
        where:{
          studentCareer: {
            centerCareer:{
              career: {
                id: idCareer
              },
              regionalCenter:{
                id: idRegionalCenter
              }
            }
          },
          tution: {
            section:{
              idPeriod:{
                id: idPeriod
              },
              // idClass: {
              //   id: +idClass
              // }
            }
          }
        }
      });


      const allFailed = await this.studentRepository.count({
        where: {
          tution: {
            note: LessThan('65'),
            section: {
              idPeriod: {
                id: idPeriod
              },
              // idClass: {
              //   id: +idClass
              // }
            }
          },
          studentCareer: {
            centerCareer: {
              career: {
                id : idCareer
              },
              regionalCenter: {
                id: idRegionalCenter
              }
            }
          },
        },
      });

      // const careers = await this.careerRepository.find();
      // const countByCareer = {};
      // for (const career of careers) {
      //   const count = await this.studentRepository.count({
      //     where: {
      //       studentCareer: {
      //         centerCareer: {
      //           career: {
      //             id: career.id
      //           }
      //         }
      //       }
      //     }
      //   });
      
      //   countByCareer[career.name] = count;
      // }

      const allClass = await this.classRepository.count({
        where: {
          careerClass:{
            idCareer: {
              id: idCareer
            }
          },
          section:{
            idClassroom:{
              idBuilding:{
                idRegionalCenter:{
                  id: idRegionalCenter
                }
              }
            },
            idPeriod: {
              id: idPeriod
            }
          }
        }
      });

      const allSection = await this.sectionRepository.count({
        where:{
          idClass: {
            // id: +idClass,
            career:{
              id: idCareer
            }
          },
          idPeriod:{
            id: idPeriod
          },
          idClassroom:{
            idBuilding:{
              idRegionalCenter:{
                id: idRegionalCenter
              }
            }
          }
        }
      });


      const employeeNumbers = await this.teacherRepository.createQueryBuilder('teacher')
        .innerJoin('teacher.section', 'section')
        .innerJoin('section.idClass', 'class')
        .where('section.idPeriod = :idPeriod', { idPeriod })
        // .andWhere('class.id = :idClass', { idClass: +idClass })
        .andWhere('class.career.id = :idCareer', { idCareer })
        .select('teacher.employeeNumber', 'employeeNumber')
        .getRawMany();

      const uniqueEmployeeNumbers = new Set(employeeNumbers.map(item => item.employeeNumber));
      const employeeCount = uniqueEmployeeNumbers.size;
      console.log(employeeCount)



    analitycs.push({name: "Estudiantes de la Carrera",count: allStudent});

    analitycs.push({name: "Estudiantes Matriculados",count: allStudentEnrolled});

    analitycs.push({name: "Estudiantes Reprobados",count: allFailed});

    analitycs.push({name: "Estudiantes Aprobados",count: (allStudentEnrolled - allFailed)});

    analitycs.push({name: "Clases",count: allClass});

    analitycs.push({name: "Secciones",count: allSection});

    analitycs.push({name: "Docentes",count: employeeCount})

      return {
        statusCode: 200,
        message: this.printMessageLog("Estadisticas obtenidas exitosamente."),
        analitics:analitycs
      }
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const analitycs = []
      const allStudent = await this.studentRepository.count();
      const allFailed = await this.studentRepository.count({
        where: {
          tution: {
            note: LessThan('65')
          }
        }
      });

      // const careers = await this.careerRepository.find();

      // const countByCareer = {};
      
      // for (const career of careers) {
      //   const count = await this.studentRepository.count({
      //     where: {
      //       studentCareer: {
      //         centerCareer: {
      //           career: {
      //             id: career.id
      //           }
      //         }
      //       }
      //     }
      //   });
      
      //   countByCareer[career.name] = count;
      // }

      analitycs.push({
        name: "Total de estudiantes Matriculados",
        count: allStudent
      })

      analitycs.push({
        name: "Total de estudiante Reprobados",
        count: allFailed
      })

      analitycs.push({
        name: "Total de estudiante Reprobados",
        count: allFailed
      })

      // analitycs.push({
      //   name: "Carreras",
      //   count: countByCareer
      // })

      return {
        statusCode: 200,
        message: this.printMessageLog("Estadisticas obtenidas exitosamente."),
        analitics:analitycs
      }
    } catch (error) {
      return this.printMessageError(error);
    }

  }


  async findOne(id: number) {
    return `This action returns a #${id} analytic`;
  }

  // async create(createAnalyticDto: CreateAnalyticDto) {
  //   return 'This action adds a new analytic';
  // }

  // async update(id: number, updateAnalyticDto: UpdateAnalyticDto) {
  //   return `This action updates a #${id} analytic`;
  // }

  // async remove(id: number) {
  //   return `This action removes a #${id} analytic`;
  // }

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



  






















  async criteria({ idPeriod, idCareer, idRegionalCenter, idClass, idSection,  failedStudent, approvedStudent }: CriteriaAnalyticDto) {
    try {
      // Verificaciones
      const periodExist = await this.periodRepository.findOne({ where: { id: idPeriod } });
      if (!periodExist) throw new NotFoundException('El periodo académico no se ha encontrado');
  
      const careerExists = await this.careerRepository.findOne({ where: { id: idCareer } });
      if (!careerExists) throw new NotFoundException('La carrera no se ha encontrado');
  
      const regionalCenterExists = await this.regionalCenterRepository.findOne({ where: { id: idRegionalCenter } });
      if (!regionalCenterExists) throw new NotFoundException('El centro regional no se ha encontrado');
  
      // Opcionales
      let classExists;
      if (idClass) {
        classExists = await this.classRepository.findOne({ where: { id: +idClass } });
        if (!classExists) throw new NotFoundException('La clase no se ha encontrado');
      }

      let sectionExists;
      if (idClass) {
        sectionExists = await this.sectionRepository.findOne({ where: { id: idSection } });
        if (!sectionExists) throw new NotFoundException('La sección no se ha encontrado');
      }
  
      // Filtros
      // const includeClasses = !idClass;
      const analytics = [];
  
      // Estudiantes de la Carrera
      const allStudents = await this.studentRepository.count({
        where: {
          studentCareer: {
            centerCareer: {
              career: {
                id: idCareer
              },
              regionalCenter: {
                id: idRegionalCenter
              }
            }
          }
        }
      });
      analytics.push({ name: "Estudiantes de la Carrera", count: allStudents });
  
      // Estudiantes Matriculados
      let allStudentsEnrolled;
      if (classExists) {
        allStudentsEnrolled = await this.studentRepository.count({
          where: {
            studentCareer: {
              centerCareer: {
                career: {
                  id: idCareer
                },
                regionalCenter: {
                  id: idRegionalCenter
                }
              }
            },
            tution: {
              section: {
                idPeriod: {
                  id: idPeriod
                },
                idClass: {
                  id: +idClass
                }
              }
            }
          }
        });
      } else {
        allStudentsEnrolled = await this.studentRepository.count({
          where: {
            studentCareer: {
              centerCareer: {
                career: {
                  id: idCareer
                },
                regionalCenter: {
                  id: idRegionalCenter
                }
              }
            },
            tution: {
              section: {
                idPeriod: {
                  id: idPeriod
                }
              }
            }
          }
        });
      }
      analytics.push({ name: "Estudiantes Matriculados", count: allStudentsEnrolled, "percentage": (allStudentsEnrolled / allStudents) * 100   });
  
      // Estudiantes Reprobados
      let allFailed;
      if (classExists) {
        allFailed = await this.studentRepository.count({
          where: {
            tution: {
              note: LessThan('65'),
              section: {
                idPeriod: {
                  id: idPeriod
                },
                idClass: {
                  id: +idClass
                }
              }
            },
            studentCareer: {
              centerCareer: {
                career: {
                  id: idCareer
                },
                regionalCenter: {
                  id: idRegionalCenter
                }
              }
            }
          }
        });
      } else {
        allFailed = await this.studentRepository.count({
          where: {
            tution: {
              note: LessThan('65'),
              section: {
                idPeriod: {
                  id: idPeriod
                }
              }
            },
            studentCareer: {
              centerCareer: {
                career: {
                  id: idCareer
                },
                regionalCenter: {
                  id: idRegionalCenter
                }
              }
            }
          }
        });
      }
      analytics.push({ name: "Estudiantes Reprobados", count: allFailed, "percentage": (allFailed / allStudentsEnrolled) * 100  });
  
      // Estudiantes Aprobados
      const allApproved = allStudentsEnrolled - allFailed;
      analytics.push({ name: "Estudiantes Aprobados", count: allApproved, "percentage": (allApproved / allStudentsEnrolled) * 100 });
  
      // Clases
      let allClasses;
      if (classExists) {
        allClasses = 1;
      } else {
        allClasses = await this.classRepository.count({
          where: {
            careerClass: {
              idCareer: {
                id: idCareer
              }
            },
            section: {
              idClassroom: {
                idBuilding: {
                  idRegionalCenter: {
                    id: idRegionalCenter
                  }
                }
              },
              idPeriod: {
                id: idPeriod
              }
            }
          }
        });
        analytics.push({ name: "Clases", count: allClasses });
      }
      
  
      // Secciones
      let allSections;
      if (classExists) {
        allSections = await this.sectionRepository.count({
          where: {
            idClass: {
              id: +idClass,
              career: {
                id: idCareer
              }
            },
            idPeriod: {
              id: idPeriod
            },
            idClassroom: {
              idBuilding: {
                idRegionalCenter: {
                  id: idRegionalCenter
                }
              }
            }
          }
        });
      } else {
        allSections = await this.sectionRepository.count({
          where: {
            idPeriod: {
              id: idPeriod
            },
            idClassroom: {
              idBuilding: {
                idRegionalCenter: {
                  id: idRegionalCenter
                }
              }
            }
          }
        });
      }
      analytics.push({ name: "Secciones", count: allSections });
  
      // Docentes
      let employeeCount;
      if (classExists) {
        const employeeNumbers = await this.teacherRepository.createQueryBuilder('teacher')
          .innerJoin('teacher.section', 'section')
          .innerJoin('section.idClass', 'class')
          .where('section.idPeriod = :idPeriod', { idPeriod })
          .andWhere('class.id = :idClass', { idClass: +idClass })
          .andWhere('class.career.id = :idCareer', { idCareer })
          .select('teacher.employeeNumber', 'employeeNumber')
          .getRawMany();
  
        const uniqueEmployeeNumbers = new Set(employeeNumbers.map(item => item.employeeNumber));
        employeeCount = uniqueEmployeeNumbers.size;
      } else {
        const employeeNumbers = await this.teacherRepository.createQueryBuilder('teacher')
          .innerJoin('teacher.section', 'section')
          .innerJoin('section.idClass', 'class')
          .innerJoin('section.idClassroom', 'classroom')
          .innerJoin('classroom.idBuilding', 'building')
          .innerJoin('building.idRegionalCenter', 'regionalCenter')
          .where('section.idPeriod = :idPeriod', { idPeriod })
          .andWhere('class.career.id = :idCareer', { idCareer })
          .andWhere('regionalCenter.id = :idRegionalCenter', { idRegionalCenter })
          .select('teacher.employeeNumber', 'employeeNumber')
          .getRawMany();
  
        const uniqueEmployeeNumbers = new Set(employeeNumbers.map(item => item.employeeNumber));
        employeeCount = uniqueEmployeeNumbers.size;
      }
      analytics.push({ name: "Docentes", count: employeeCount });
  
      return {
        statusCode: 200,
        message: this.printMessageLog("Estadísticas obtenidas exitosamente."),
        analytics: analytics
      };
    } catch (error) {
      // console.log(error)
      return this.printMessageError(error);
    }
  }
  
}
