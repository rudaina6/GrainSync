package com.plant_management.service;

import com.plant_management.dto.BatchRequestDTO;
import com.plant_management.entity.*;
import com.plant_management.repository.*;
import org.hibernate.engine.jdbc.batch.spi.Batch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RawMaterialInventoryStorageRepository rawMaterialInventoryStorageRepository;

    @Autowired
    private ProductInventoryStorageRepository productInventoryStorageRepository;

    public Batches saveBatch(Batches batch, Integer employee_id, Integer product_id, Integer r_storage_unit_id) {

        Employee employee = employeeRepository.findById(employee_id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Products product = productRepository.findById(product_id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        batch.setEmployee(employee);
        batch.setProduct(product);

        RawMaterialInventoryStorage rawStorage = rawMaterialInventoryStorageRepository.findById(r_storage_unit_id)
                .orElseThrow(() -> new RuntimeException("Raw material storage unit not found"));

        if (rawStorage.getQuantity_stored() < batch.getQuantity_used()) {
            throw new RuntimeException("Not enough raw material in storage");
        }

        rawStorage.setQuantity_stored(rawStorage.getQuantity_stored() - batch.getQuantity_used());
        rawMaterialInventoryStorageRepository.save(rawStorage);

        List<ProductInventoryStorage> productUnits = productInventoryStorageRepository
                .findByProducts(product);

        if (productUnits.isEmpty()) {
            throw new RuntimeException("No product storage units found for this product.");
        }

        ProductInventoryStorage suitableUnit = productUnits.stream()
                .filter(unit -> unit.getCapacity() - unit.getQuantity_stored() >= batch.getQuantity_produced())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No product storage unit has enough capacity."));

        suitableUnit.setQuantity_stored(suitableUnit.getQuantity_stored() + batch.getQuantity_produced());
        productInventoryStorageRepository.save(suitableUnit);

        return batchRepository.save(batch);
    }
    public ResponseEntity<?> logBatch(BatchRequestDTO dto) {
        Optional<Employee> employeeOpt = employeeRepository.findById(Math.toIntExact(dto.getEmployee_id()));
        Optional<Products> productOpt = productRepository.findById(Math.toIntExact(dto.getProduct_id()));

        if (employeeOpt.isEmpty() || productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid employee or product ID.");
        }

        RawMaterialInventoryStorage rawStorage = rawMaterialInventoryStorageRepository.findById(Math.toIntExact(dto.getR_storage_unit_id()))
                .orElse(null);
        ProductInventoryStorage productStorage = productInventoryStorageRepository.findById(Math.toIntExact(dto.getP_storage_unit_id()))
                .orElse(null);
        System.out.println("Product ID: " + dto.getProduct_id());

        if (rawStorage == null || productStorage == null) {
            return ResponseEntity.badRequest().body("Invalid storage unit.");
        }

        if (rawStorage.getQuantity_stored() < dto.getQuantity_used()) {
            return ResponseEntity.badRequest().body("Insufficient raw material in storage.");
        }

        rawStorage.setQuantity_stored(rawStorage.getQuantity_stored() - dto.getQuantity_used());
        productStorage.setQuantity_stored(productStorage.getQuantity_stored() + dto.getQuantity_produced());
        rawMaterialInventoryStorageRepository.save(rawStorage);
        productInventoryStorageRepository.save(productStorage);

        Batches batch = new Batches();
        batch.setEmployee(employeeOpt.get());
        batch.setProduct(productOpt.get());
        batch.setQuantity_used(dto.getQuantity_used());
        batch.setQuantity_produced(dto.getQuantity_produced());


        return ResponseEntity.ok(batchRepository.save(batch));
    }


    public List<Batches> getAllBatches() {
        return batchRepository.findAll();
    }

    public Batches getBatchById(Integer id) {
        return batchRepository.findById(id).orElse(null);
    }

    public void deleteBatch(Integer id) {
        batchRepository.deleteById(id);
    }

    public List<Products> getAllProducts() {
        return productRepository.findAll();
    }
}
