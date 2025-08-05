package com.plant_management.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@Builder
public class BillResponseDTO {

    private Integer bill_id;
    private BigDecimal amount;
    private LocalDate issue_date;
    private LocalDate due_date;
    private String bill_type;
    private String payment_method;

    public BillResponseDTO(Integer bill_id, BigDecimal amount, LocalDate issue_date, LocalDate due_date, String bill_type, String payment_method) {
        this.bill_id = bill_id;
        this.amount = amount;
        this.issue_date = issue_date;
        this.due_date = due_date;
        this.bill_type = bill_type;
        this.payment_method = payment_method;
    }
}
