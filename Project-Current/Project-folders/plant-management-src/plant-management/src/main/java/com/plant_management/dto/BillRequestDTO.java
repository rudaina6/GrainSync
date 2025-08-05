package com.plant_management.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillRequestDTO {
    private BigDecimal amount;
    private LocalDate issue_date;
    private LocalDate due_date;
    private String bill_type;
    private String payment_method;
    private String type = "withdrawal";
    private Integer accountant_id;
}
