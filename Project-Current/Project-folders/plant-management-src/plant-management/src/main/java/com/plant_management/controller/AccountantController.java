package com.plant_management.controller;

import com.plant_management.entity.Accountant;
import com.plant_management.service.AccountantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accountants")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountantController {

    @Autowired
    private AccountantService accountantService;

    @GetMapping
    public List<Accountant> getAllAccountants() {
        return accountantService.getAllAccountants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Accountant> getAccountantById(@PathVariable int id) {
        Optional<Accountant> accountant = accountantService.getAccountantById(id);
        return accountant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Accountant saveAccountant(@RequestBody Accountant accountant) {
        return accountantService.saveAccountant(accountant);
    }

    @DeleteMapping("/{id}")
    public void deleteAccountant(@PathVariable int id) {
        accountantService.deleteAccountant(id);
    }
}