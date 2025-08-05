package com.plant_management.controller;

import com.plant_management.entity.RawMaterialInventoryStorage;
import com.plant_management.service.RawMaterialInventoryStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage-units")
public class RawMaterialInventoryStorageController {

    @Autowired
    private RawMaterialInventoryStorageService service;

    @GetMapping
    public List<RawMaterialInventoryStorage> getAllStorageUnits() {
        return service.getAllStorageUnits();
    }

    @GetMapping("/{id}")
    public RawMaterialInventoryStorage getStorageUnitById(@PathVariable Integer id) {
        return service.getStorageUnitById(id)
                .orElseThrow(() -> new RuntimeException("Storage unit not found"));
    }

    @PostMapping
    public RawMaterialInventoryStorage createStorageUnit(@RequestBody RawMaterialInventoryStorage storage) {
        return service.saveStorageUnit(storage);
    }

    @PutMapping("/{id}")
    public RawMaterialInventoryStorage updateStorageUnit(@PathVariable Integer id,
                                                         @RequestBody RawMaterialInventoryStorage updatedStorage) {
        return service.updateStorageUnit(id, updatedStorage);
    }

    @DeleteMapping("/{id}")
    public void deleteStorageUnit(@PathVariable Integer id) {
        service.deleteStorageUnit(id);
    }
}
