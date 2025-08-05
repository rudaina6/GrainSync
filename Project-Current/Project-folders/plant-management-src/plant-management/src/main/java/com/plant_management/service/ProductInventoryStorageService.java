package com.plant_management.service;


import com.plant_management.dto.ProductInventoryDTO;
import com.plant_management.entity.ProductInventoryStorage;

import com.plant_management.repository.ProductInventoryStorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ProductInventoryStorageService {

    @Autowired
    private ProductInventoryStorageRepository repository;

    public List<ProductInventoryStorage> getAllUnits() {
        return repository.findAll();
    }

    public List<ProductInventoryDTO> getProductInventoryDTOs() {
        return repository.findAll().stream().map(inv -> new ProductInventoryDTO(
                inv.getP_storage_unit_id(),
                inv.getCapacity(),
                inv.getQuantity_stored(),
                inv.getProducts().getProduct_id(),
                inv.getProducts().getName(),
                inv.getProducts().getUnit_of_measurement(),
                inv.getProducts().getPrice_per_unit()
        )).collect(Collectors.toList());
    }

    public Optional<ProductInventoryStorage> getUnitById(Integer id) {
        return repository.findById(id);
    }

    public ProductInventoryStorage saveUnit(ProductInventoryStorage unit) {
        return repository.save(unit);
    }

    public void deleteUnit(Integer id) {
        repository.deleteById(id);
    }

}
