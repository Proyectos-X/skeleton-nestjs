import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(private configService: ConfigService) {}

  create(createProductDto: CreateProductDto) {
    console.log(createProductDto);

    return 'This action adds a new product';
  }

  findAll() {
    return this.configService.get<string>('BASE_URL');
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);

    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
