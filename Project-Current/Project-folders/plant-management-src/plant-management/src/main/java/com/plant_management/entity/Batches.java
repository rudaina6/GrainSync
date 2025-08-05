package com.plant_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Batches {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer batch_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Products product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "quantity_used")
    private Float quantity_used;

    @Column(name = "quantity_produced")
    private Float quantity_produced;

    @Column(name = "start_time")
    private String start_time;

    @Column(name = "end_time")
    private String end_time;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "r_storage_unit_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private RawMaterialInventoryStorage rawMaterialInventoryStorage;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_storage_unit_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductInventoryStorage productInventoryStorage;
}
