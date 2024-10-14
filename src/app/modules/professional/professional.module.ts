import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Professional, ProfessionalSchema } from '@app/modules/professional/models/professional.model';
import { ProfessionalService } from '@app/modules/professional/services/professional.service';
import { ProfessionalController } from '@app/modules/professional/controllers/professional.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Professional.name, schema: ProfessionalSchema }])],
  providers: [ProfessionalService],
  controllers: [ProfessionalController],
})
export class ProfessionalModule  {}