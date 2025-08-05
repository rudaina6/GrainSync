package com.plant_management.service;

import com.plant_management.entity.RawMaterialInventoryStorage;
import com.plant_management.repository.RawMaterialInventoryStorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RawMaterialInventoryStorageService {

    @Autowired
    private RawMaterialInventoryStorageRepository repository;

    public List<RawMaterialInventoryStorage> getAllStorageUnits() {
        return repository.findAll();
    }

    public Optional<RawMaterialInventoryStorage> getStorageUnitById(Integer id) {
        return repository.findById(id);
    }

    public RawMaterialInventoryStorage saveStorageUnit(RawMaterialInventoryStorage storage) {
        return repository.save(storage);
    }

    public void deleteStorageUnit(Integer id) {
        repository.deleteById(id);
    }

    public RawMaterialInventoryStorage updateStorageUnit(Integer id, RawMaterialInventoryStorage updatedStorage) {
        return repository.findById(id).map(existing -> {
            existing.setCapacity(updatedStorage.getCapacity());
            existing.setQuantity_stored(updatedStorage.getQuantity_stored());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Storage unit not found"));
    }
}
