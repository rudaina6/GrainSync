package com.plant_management.entity;

import lombok.*;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer product_id;
    private String name;
    private String unit_of_measurement;
    private BigDecimal price_per_unit;

}