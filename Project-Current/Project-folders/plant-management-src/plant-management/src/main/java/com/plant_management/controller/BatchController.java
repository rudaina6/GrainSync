package com.plant_management.controller;

import com.plant_management.dto.BatchRequestDTO;
import com.plant_management.entity.Batches;
import com.plant_management.service.BatchService;
import org.hibernate.engine.jdbc.batch.spi.Batch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "*")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @PostMapping
    public ResponseEntity<?> logBatch(@RequestBody Map<String, Object> payload) {
        try {
            Integer product_id = (Integer) payload.get("product_id");
            Integer employee_id = (Integer) payload.get("employee_id");
            Integer r_storage_unit_id = (Integer) payload.get("r_storage_unit_id");

            Float quantity_used = ((Number) payload.get("quantity_used")).floatValue();
            Float quantity_produced = ((Number) payload.get("quantity_produced")).floatValue();

            String start_time = (String) payload.get("start_time");
            String end_time = (String) payload.get("end_time");

            Batches batch = new Batches();
            batch.setStart_time(start_time);
            batch.setEnd_time(end_time);
            batch.setQuantity_used(quantity_used);
            batch.setQuantity_produced(quantity_produced);

            Batches saved = batchService.saveBatch(batch, employee_id, product_id, r_storage_unit_id);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to log batch: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Batches> getAllBatches() {
        return batchService.getAllBatches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBatchById(@PathVariable Integer id) {
        Batches batch = batchService.getBatchById(id);
        if (batch == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(batch);
    }
    @PostMapping("/log")
    public ResponseEntity<?> logBatch(@RequestBody BatchRequestDTO dto) {
        return batchService.logBatch(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBatch(@PathVariable Integer id) {
        if (batchService.getBatchById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        batchService.deleteBatch(id);
        return ResponseEntity.ok().build();
    }
}
