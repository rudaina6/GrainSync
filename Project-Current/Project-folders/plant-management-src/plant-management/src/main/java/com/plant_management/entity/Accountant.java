package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accountant")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Accountant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountant_id")
    private int accountantId;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "domain", nullable = false)
    private String domain;
}