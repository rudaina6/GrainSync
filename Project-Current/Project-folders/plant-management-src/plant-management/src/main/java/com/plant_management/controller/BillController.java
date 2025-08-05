package com.plant_management.controller;

import com.plant_management.dto.BillRequestDTO;
import com.plant_management.dto.BillResponseDTO;
import com.plant_management.entity.Bill;
import com.plant_management.service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    public List<BillResponseDTO> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Integer id) {
        return billService.getBillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<String> createBill(@RequestBody BillRequestDTO dto) {
        billService.createBillViaProcedure(dto);
        return ResponseEntity.ok("Bill successfully created.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Integer id, @RequestBody Bill updatedBill) {
        return billService.getBillById(id)
                .map(existing -> {
                    updatedBill.setBill_id(id);
                    return ResponseEntity.ok(billService.saveBill(updatedBill));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Integer id) {
        if (billService.getBillById(id).isPresent()) {
            billService.deleteBill(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
