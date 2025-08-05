package com.plant_management.entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
@Table(name = "raw_material_inventory_storage")
public class RawMaterialInventoryStorage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "r_storage_unit_id")
    private Integer id;

    @Column(name = "capacity")
    private Float capacity;

    private Float quantity_stored;

}
