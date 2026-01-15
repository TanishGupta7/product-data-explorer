import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateProductDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsString()
    price: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsUrl()
    productUrl: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    condition?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
