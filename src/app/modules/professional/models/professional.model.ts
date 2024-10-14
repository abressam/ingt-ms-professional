import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Professional extends Document {
   @Prop({ index: true })
   uuid: string;   
   
   @Prop()
   crp: string;   
   
   @Prop()
   patientId: string;   
   
   @Prop()
   startOfAppointments: string;   

   @Prop({ type: Map, of: MongooseSchema.Types.Mixed })
   responses: Map<string, string | string[]>;
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);