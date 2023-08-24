import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('shipping-details')
export class ShippingDetailsEntity extends BaseEntity{
    @PrimaryGeneratedColumn({ comment: 'PK Auto Increment' })
    id: number;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    email: string;

    @Column({ default: null })
    address: string;

    @Column({ default: null })
    city: string;

    @Column({ default: null })
    country: string;

    @Column({ default: null })
    pin_code: string;

    @Column({ default: null })
    bought_by: number;
}