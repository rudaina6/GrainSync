package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orders_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(OrdersProductsId.class)
public class OrdersProducts {

    @Id
    private Integer order_id;

    @Id
    private Integer product_id;

    private Float quantity;
}