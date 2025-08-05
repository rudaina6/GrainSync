package com.plant_management.service;

import com.plant_management.entity.Supplier;
import com.plant_management.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Integer id) {
        return supplierRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Supplier not found with ID: " + id)
        );
    }

    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Integer id, Supplier supplierDetails) {
        Supplier existingSupplier = getSupplierById(id);
        existingSupplier.setName(supplierDetails.getName());
        existingSupplier.setEmail(supplierDetails.getEmail());
        existingSupplier.setPhone(supplierDetails.getPhone());
        existingSupplier.setAddress(supplierDetails.getAddress());
        existingSupplier.setCity(supplierDetails.getCity());
        return supplierRepository.save(existingSupplier);
    }

    public void deleteSupplierById(Integer id) {
        supplierRepository.deleteById(id);
    }
}