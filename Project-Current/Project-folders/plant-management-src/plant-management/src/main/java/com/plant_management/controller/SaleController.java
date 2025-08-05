package com.plant_management.controller;

import com.plant_management.entity.Sale;
import com.plant_management.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/{id}")
    public Optional<Sale> getSaleById(@PathVariable int id) {
        return saleService.getSaleById(id);
    }

    @PostMapping
    public Sale addSale(@RequestBody Sale sale) {
        return saleService.addSale(sale);
    }

    @PutMapping
    public Sale updateSale(@RequestBody Sale sale) {
        return saleService.updateSale(sale);
    }

    @DeleteMapping("/{id}")
    public void deleteSale(@PathVariable int id) {
        saleService.deleteSale(id);
    }
}
