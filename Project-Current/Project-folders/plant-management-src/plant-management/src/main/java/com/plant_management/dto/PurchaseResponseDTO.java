package com.plant_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class PurchaseResponseDTO {
    private Integer purchase_id;
    private String supplier_name;
    private LocalDate date_of_purchase;
    private LocalDate delivery_date;
    private String unit_of_measurement;
    private Float units_bought;
    private Float price_per_unit;
    private Float total_cost;
}

