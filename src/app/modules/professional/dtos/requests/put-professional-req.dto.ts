import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsDateString, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PutProfessionalReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    startOfAppointments?: string;
  
    @ApiProperty({
        type: 'object',
        additionalProperties: {
            oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }]
        }
    })
    @IsObject()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Object)
    responses?: Map<string, string | string[]>;
}