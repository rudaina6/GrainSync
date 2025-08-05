package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bill_id;

    private LocalDate issue_date;
    private LocalDate due_date;
    private String bill_type;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;
}
