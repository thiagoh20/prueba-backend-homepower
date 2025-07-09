import { IsString, IsNotEmpty, IsNumber, IsPositive, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  @Transform(({ value }) => parseFloat(value))
  precio: number;

  @IsNumber({}, { message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Transform(({ value }) => parseInt(value))
  stock: number;
}

