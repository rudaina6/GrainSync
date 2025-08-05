package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;
@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Integer transaction_id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(name = "date_of_transaction", nullable = false)
    private Date date_of_transaction;

    @ManyToOne
    @JoinColumn(name = "accountant_id", nullable = false)
    private Accountant accountant;

    @Column(name = "payment_method", nullable = false)
    private String payment_method;

    public enum TransactionType {
        withdrawal,
        deposit
    }
}

