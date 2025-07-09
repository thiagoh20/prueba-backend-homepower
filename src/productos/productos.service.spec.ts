import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto, UpdateProductoDto } from './dto';

describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<Producto>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockProducto: Producto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nombre: 'Producto Test',
    precio: 99.99,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<Producto>>(getRepositoryToken(Producto));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new producto', async () => {
      const createProductoDto: CreateProductoDto = {
        nombre: 'Producto Test',
        precio: 99.99,
        stock: 10,
      };

      mockRepository.create.mockReturnValue(mockProducto);
      mockRepository.save.mockResolvedValue(mockProducto);

      const result = await service.create(createProductoDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createProductoDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProducto);
      expect(result).toEqual(mockProducto);
    });

    it('should throw BadRequestException when save fails', async () => {
      const createProductoDto: CreateProductoDto = {
        nombre: 'Producto Test',
        precio: 99.99,
        stock: 10,
      };

      mockRepository.create.mockReturnValue(mockProducto);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createProductoDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of productos', async () => {
      const productos = [mockProducto];
      mockRepository.find.mockResolvedValue(productos);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(productos);
    });
  });

  describe('findOne', () => {
    it('should return a producto by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducto);

      const result = await service.findOne(mockProducto.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducto.id },
      });
      expect(result).toEqual(mockProducto);
    });

    it('should throw NotFoundException when producto not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a producto', async () => {
      const updateProductoDto: UpdateProductoDto = {
        nombre: 'Producto Actualizado',
        precio: 149.99,
      };

      const updatedProducto = { ...mockProducto, ...updateProductoDto };

      mockRepository.findOne.mockResolvedValue(mockProducto);
      mockRepository.save.mockResolvedValue(updatedProducto);

      const result = await service.update(mockProducto.id, updateProductoDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducto.id },
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedProducto);
    });

    it('should throw NotFoundException when producto not found', async () => {
      const updateProductoDto: UpdateProductoDto = {
        nombre: 'Producto Actualizado',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateProductoDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a producto', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducto);
      mockRepository.remove.mockResolvedValue(mockProducto);

      await service.remove(mockProducto.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducto.id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProducto);
    });

    it('should throw NotFoundException when producto not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStock', () => {
    it('should update producto stock', async () => {
      const newStock = 20;
      const updatedProducto = { ...mockProducto, stock: newStock };

      mockRepository.findOne.mockResolvedValue(mockProducto);
      mockRepository.save.mockResolvedValue(updatedProducto);

      const result = await service.updateStock(mockProducto.id, newStock);

      expect(result.stock).toBe(newStock);
    });

    it('should throw BadRequestException for negative stock', async () => {
      await expect(service.updateStock(mockProducto.id, -1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByPriceRange', () => {
    it('should return productos within price range', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProducto]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByPriceRange(50, 150);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('producto');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'producto.precio >= :minPrice',
        { minPrice: 50 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'producto.precio <= :maxPrice',
        { maxPrice: 150 },
      );
      expect(result).toEqual([mockProducto]);
    });
  });
});

