package com.plant_management.entity;
import lombok.*;
import jakarta.persistence.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionId implements java.io.Serializable {
    private Integer transactionNumber;
    private Integer accountantId;
}
