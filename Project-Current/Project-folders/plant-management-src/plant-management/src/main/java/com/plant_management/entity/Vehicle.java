package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer vehicle_id;

    private String type;

    private String license_plate;

    private String model;

    private Float capacity;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        active, inactive
    }
}