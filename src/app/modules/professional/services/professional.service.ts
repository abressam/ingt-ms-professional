import { ProfessionalServiceInterface } from '@app/modules/professional/services/professional.service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Professional } from '@app/modules/professional/models/professional.model';
import { ProfessionalDto } from '@app/modules/professional/dtos/professional.dto';
import { DeleteProfessionalResDto } from '@app/modules/professional/dtos/responses/delete-professional-res.dto';
import { GetProfessionalResDto } from '@app/modules/professional/dtos/responses/get-professional-res.dto';
import { PostProfessionalReqDto } from '@app/modules/professional/dtos/requests/post-professional-req.dto';
import { PutProfessionalReqDto } from '@app/modules/professional/dtos/requests/put-professional-req.dto';
import { generateUuid, convertToISODate } from '@app/modules/professional/utils/professional.util';

@Injectable()
export class ProfessionalService implements ProfessionalServiceInterface {
  constructor(
    @InjectModel(Professional.name)
    private professionalModel: Model<Professional>,
  ) {}

  async getPacientCase(
    crp: string, 
    patientId?: string, 
    startDate?: string,
    endDate?: string
    ): Promise<GetProfessionalResDto> {
    this.validateAuth(crp);
    const filter: any = { crp: crp };

    if (startDate && !endDate) {
        throw new HttpException('endDate is required when startDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (!startDate && endDate) {
        throw new HttpException('startDate is required when endDate is provided', HttpStatus.BAD_REQUEST);
    }

    if (startDate) {
        const ISOstartDate = convertToISODate(startDate);
        filter.date = { $gte: ISOstartDate }; // Adiciona um filtro para >= startDate
    }

    if (endDate) {
        const ISOendDate = convertToISODate(endDate);
    if (filter.date) {
        filter.date = { ...filter.date, $lte: ISOendDate }; // Adiciona um filtro para <= endDate
    } else {
        filter.date = { $lte: ISOendDate }; // Cria um novo filtro para <= endDate
    }
    }
 
    if (patientId) {
        filter.patientId = patientId;
    }
 
    const cases = await this.professionalModel.find(filter).exec();
 
    if (!cases || cases.length === 0) {
        return { professional: [] };
    }
 
    return { 
       professional: cases.map(professional => professional) 
    };
  }

  async postCase(crp: string, body: PostProfessionalReqDto): Promise<GetProfessionalResDto> {
    this.validateAuth(crp);

    if(crp == null) {
      throw new HttpException('Only professionals can create appointments', HttpStatus.UNAUTHORIZED);
    }

    const uuid = generateUuid();

    const createdAppointment = new this.professionalModel({
      ...body,
      crp: crp,
      uuid: uuid,
    });
    
    const professional = await createdAppointment.save();

    return {
      professional: [{
        crp: professional.crp,
        patientId: professional.patientId,
        startOfAppointments: professional.startOfAppointments,
        responses: professional.responses
      }],
    };
  }

  async putCase(crp: string, body: PutProfessionalReqDto): Promise<GetProfessionalResDto> {
    this.validateAuth(crp);

    const caseOld = await this.professionalModel.findOne({ uuid: body.uuid }).exec();

    this.validateCase(caseOld);

    // Mantém o uuid e adiciona um novo registro, preservando o anterior
    const caseNew = new this.professionalModel({
        ...caseOld.toObject(), // Copia os dados antigos
        ...body,              // Atualiza com os novos dados
        createdAt: new Date(), // Atualiza a data de criação
    });

    await caseNew.save();

    return {
      professional: [{
        crp: caseNew.crp,
        patientId: caseNew.patientId,
        startOfAppointments: caseNew.startOfAppointments,
        responses: caseNew.responses
        }],
    };
  }

  async deleteHistory(crp: string, uuid: string): Promise<DeleteProfessionalResDto> {
    this.validateAuth(crp);

    const professional = await this.professionalModel.findOne({ uuid: uuid }).exec();

    this.validateCase(professional);

    await this.professionalModel.deleteMany({ uuid: uuid });

    return {
      statusCode: 200,
      message: 'Case history successfully deleted',
    };
  }

  private validateCase(professional: ProfessionalDto) {
    if (!professional) {
      throw new HttpException('No case found', HttpStatus.NOT_FOUND);
    }
  }

  private validateAuth(user: any) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}