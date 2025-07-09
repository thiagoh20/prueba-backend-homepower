import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto';
import { Producto } from './entities/producto.entity';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockProductosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByName: jest.fn(),
    findByPriceRange: jest.fn(),
    updateStock: jest.fn(),
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
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: mockProductosService,
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new producto', async () => {
      const createProductoDto: CreateProductoDto = {
        nombre: 'Producto Test',
        precio: 99.99,
        stock: 10,
      };

      mockProductosService.create.mockResolvedValue(mockProducto);

      const result = await controller.create(createProductoDto);

      expect(service.create).toHaveBeenCalledWith(createProductoDto);
      expect(result).toEqual(mockProducto);
    });
  });

  describe('findAll', () => {
    it('should return all productos when no query params', async () => {
      const productos = [mockProducto];
      mockProductosService.findAll.mockResolvedValue(productos);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(productos);
    });

    it('should return productos by name when nombre query param provided', async () => {
      const productos = [mockProducto];
      mockProductosService.findByName.mockResolvedValue(productos);

      const result = await controller.findAll('Producto Test');

      expect(service.findByName).toHaveBeenCalledWith('Producto Test');
      expect(result).toEqual(productos);
    });

    it('should return productos by price range when price params provided', async () => {
      const productos = [mockProducto];
      mockProductosService.findByPriceRange.mockResolvedValue(productos);

      const result = await controller.findAll(undefined, '50', '150');

      expect(service.findByPriceRange).toHaveBeenCalledWith(50, 150);
      expect(result).toEqual(productos);
    });
  });

  describe('findOne', () => {
    it('should return a producto by id', async () => {
      mockProductosService.findOne.mockResolvedValue(mockProducto);

      const result = await controller.findOne(mockProducto.id);

      expect(service.findOne).toHaveBeenCalledWith(mockProducto.id);
      expect(result).toEqual(mockProducto);
    });
  });

  describe('update', () => {
    it('should update a producto', async () => {
      const updateProductoDto: UpdateProductoDto = {
        nombre: 'Producto Actualizado',
        precio: 149.99,
      };

      const updatedProducto = { ...mockProducto, ...updateProductoDto };
      mockProductosService.update.mockResolvedValue(updatedProducto);

      const result = await controller.update(mockProducto.id, updateProductoDto);

      expect(service.update).toHaveBeenCalledWith(mockProducto.id, updateProductoDto);
      expect(result).toEqual(updatedProducto);
    });
  });

  describe('remove', () => {
    it('should remove a producto', async () => {
      mockProductosService.remove.mockResolvedValue(undefined);

      await controller.remove(mockProducto.id);

      expect(service.remove).toHaveBeenCalledWith(mockProducto.id);
    });
  });

  describe('updateStock', () => {
    it('should update producto stock', async () => {
      const newStock = 20;
      const updatedProducto = { ...mockProducto, stock: newStock };
      mockProductosService.updateStock.mockResolvedValue(updatedProducto);

      const result = await controller.updateStock(mockProducto.id, newStock);

      expect(service.updateStock).toHaveBeenCalledWith(mockProducto.id, newStock);
      expect(result).toEqual(updatedProducto);
    });
  });
});

