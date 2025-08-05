package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "supervisor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supervisor_id")
    private int supervisorId;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "office_no", nullable = false)
    private String officeNo;
}