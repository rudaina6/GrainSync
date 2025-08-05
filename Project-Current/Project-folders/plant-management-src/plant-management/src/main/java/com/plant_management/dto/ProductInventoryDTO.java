package com.plant_management.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductInventoryDTO {
    private Integer p_storage_unit_id;
    private Float capacity;
    private Float quantity_stored;
    private Integer product_id;
    private String name;
    private String unit_of_measurement;
    private BigDecimal price_per_unit;
}

