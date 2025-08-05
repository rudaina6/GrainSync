package com.plant_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
@Table(name = "product_inventory_storage")
public class ProductInventoryStorage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_storage_unit_id")
    private Integer p_storage_unit_id;

    @Column(name = "capacity")
    private Float capacity;

    @Column(name = "quantity_stored")
    private Float quantity_stored;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    private Products products;
}
