package com.plant_management.dto;

import java.time.LocalDateTime;
import lombok.*;

@Data
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class BatchRequestDTO {
    private Long product_id;
    private Long employee_id;
    private Float quantity_used;
    private Float quantity_produced;
    private LocalDateTime start_time;
    private LocalDateTime end_time;
    private Long r_storage_unit_id;
    private Long p_storage_unit_id;


}
