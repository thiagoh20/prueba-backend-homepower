import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto';
import { Producto } from './entities/producto.entity';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductoDto: CreateProductoDto): Promise<Producto> {
    return await this.productosService.create(createProductoDto);
  }

  @Get()
  async findAll(
    @Query('nombre') nombre?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<Producto[]> {
    // Si se proporciona un nombre, buscar por nombre
    if (nombre) {
      return await this.productosService.findByName(nombre);
    }

    // Si se proporcionan rangos de precio, buscar por rango
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      
      if (isNaN(min) || isNaN(max)) {
        throw new Error('Los parámetros de precio deben ser números válidos');
      }
      
      return await this.productosService.findByPriceRange(min, max);
    }

    // Por defecto, devolver todos los productos
    return await this.productosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Producto> {
    return await this.productosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    return await this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.productosService.remove(id);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('stock') stock: number,
  ): Promise<Producto> {
    return await this.productosService.updateStock(id, stock);
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  healthCheck(): string {
    return 'API de Productos está activa y funcionando correctamente';
  }
}

