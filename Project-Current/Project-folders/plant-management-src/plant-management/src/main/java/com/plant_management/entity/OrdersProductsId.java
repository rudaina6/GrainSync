package com.plant_management.entity;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrdersProductsId implements Serializable {

    private Integer order_id;
    private Integer product_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrdersProductsId)) return false;
        OrdersProductsId that = (OrdersProductsId) o;
        return Objects.equals(order_id, that.order_id) && Objects.equals(product_id, that.product_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(order_id, product_id);
    }
}