package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_id")
    private Integer purchase_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "date_of_purchase")
    private LocalDate date_of_purchase;

    @Column(name = "delivery_date")
    private LocalDate delivery_date;

    @Column(name = "unit_of_measurement")
    private String unit_of_measurement;

    @Column(name = "units_bought")
    private Float units_bought;

    @Column(name = "price_per_unit")
    private Float price_per_unit = 30.0f;
}