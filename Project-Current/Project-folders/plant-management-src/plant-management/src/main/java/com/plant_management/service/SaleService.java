package com.plant_management.service;

import com.plant_management.entity.Sale;
import com.plant_management.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(int sale_id) {
        return saleRepository.findById(sale_id);
    }

    public Sale addSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public void deleteSale(int sale_id) {
        saleRepository.deleteById(sale_id);
    }

    public Sale updateSale(Sale sale) {
        return saleRepository.save(sale);
    }
}
