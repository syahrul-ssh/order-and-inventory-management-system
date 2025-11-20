import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: true })
  name?: string;

  @Column('int')
  stock: number;
}