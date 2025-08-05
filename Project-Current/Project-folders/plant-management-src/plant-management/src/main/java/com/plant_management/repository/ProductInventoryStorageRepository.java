package com.plant_management.repository;

import com.plant_management.entity.ProductInventoryStorage;
import com.plant_management.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductInventoryStorageRepository extends JpaRepository<ProductInventoryStorage, Integer> {
    List<ProductInventoryStorage> findByProducts(Products products);
}
