package com.plant_management.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    private int sale_id;

    @Column(name = "transaction_id", nullable = false)
    private int transaction_id;

    @Column(name = "order_id", nullable = false)
    private int order_id;

    @Column(name = "units_sold")
    private float units_sold;

    @Column(name = "status")
    private String status;
}
