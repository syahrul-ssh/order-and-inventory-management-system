import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ArrayMinSize(1)
  items: OrderItemDto[];
}
