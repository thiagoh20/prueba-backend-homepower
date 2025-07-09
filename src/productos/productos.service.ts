import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto, UpdateProductoDto } from './dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      const producto = this.productoRepository.create(createProductoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);

    try {
      Object.assign(producto, updateProductoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el producto');
    }
  }

  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);

    try {
      await this.productoRepository.remove(producto);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el producto');
    }
  }

  async findByName(nombre: string): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { nombre: nombre },
    });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Producto[]> {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.precio >= :minPrice', { minPrice })
      .andWhere('producto.precio <= :maxPrice', { maxPrice })
      .orderBy('producto.precio', 'ASC')
      .getMany();
  }

  async updateStock(id: string, newStock: number): Promise<Producto> {
    if (newStock < 0) {
      throw new BadRequestException('El stock no puede ser negativo');
    }

    const producto = await this.findOne(id);
    producto.stock = newStock;
    
    return await this.productoRepository.save(producto);
  }
}

