import { DeleteProfessionalResDto } from '@app/modules/professional/dtos/responses/delete-professional-res.dto';
import { GetProfessionalResDto } from '@app/modules/professional/dtos/responses/get-professional-res.dto';
import { PostProfessionalReqDto } from '@app/modules/professional/dtos/requests/post-professional-req.dto';
import { PutProfessionalReqDto } from '@app/modules/professional/dtos/requests/put-professional-req.dto';

export interface ProfessionalServiceInterface {
    getPacientCase(
        crp: string, 
        patientId?: string, 
        startDate?: string,
        endDate?: string
    ): Promise<GetProfessionalResDto>;
    postCase(crp: string, body: PostProfessionalReqDto): Promise<GetProfessionalResDto>;
    putCase(crp: string, body: PutProfessionalReqDto): Promise<GetProfessionalResDto>;
    deleteHistory(crp: string, uuid: string): Promise<DeleteProfessionalResDto>;
}