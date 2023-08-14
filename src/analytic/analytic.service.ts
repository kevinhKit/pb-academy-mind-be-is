import { Injectable, Logger } from '@nestjs/common';
import { CreateAnalyticDto } from './dto/create-analytic.dto';
import { UpdateAnalyticDto } from './dto/update-analytic.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  ) {}

  
  async findAll() {
    return `This action returns all analytic`;
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
}
