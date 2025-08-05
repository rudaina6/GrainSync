package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private Integer order_id;

    private Integer customer_id;

    private Integer employee_id;

    private LocalDate order_date;

    private String status;

    private String address;
}