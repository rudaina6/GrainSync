package com.plant_management.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private int customer_id;
    private int employee_id;
    private String status;
    private String order_date;
    private List<OrderProductDTO> products;
    private int accountant_id;

}