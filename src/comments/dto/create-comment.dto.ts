import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsUUID()
  adId: string;

  @IsUUID()
  userId: string;
}
