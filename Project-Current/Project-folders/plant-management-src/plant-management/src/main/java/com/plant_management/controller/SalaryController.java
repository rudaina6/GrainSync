package com.plant_management.controller;

import com.plant_management.entity.Salaries;
import com.plant_management.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@CrossOrigin(origins = "http://localhost:5173")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @PostMapping
    public ResponseEntity<Salaries> createSalary(
            @RequestParam Integer employeeId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @RequestParam BigDecimal baseAmount,
            @RequestParam BigDecimal bonus,
            @RequestParam BigDecimal fine,
            @RequestParam Integer accountantId,
            @RequestParam String paymentMethod) {
        try {
            Salaries salary = salaryService.createSalary(employeeId, date, baseAmount, bonus, fine, accountantId, paymentMethod);
            return ResponseEntity.ok(salary);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{salaryId}")
    public ResponseEntity<Salaries> updateSalary(
            @PathVariable Integer salaryId,
            @RequestParam BigDecimal bonus,
            @RequestParam BigDecimal fine) {
        try {
            Salaries salary = salaryService.updateSalary(salaryId, bonus, fine);
            return ResponseEntity.ok(salary);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Salaries>> getAllSalaries() {
        return ResponseEntity.ok(salaryService.getAllSalaries());
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Salaries>> getSalariesByDate(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        return ResponseEntity.ok(salaryService.getSalariesByDate(date));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Salaries>> getSalariesByEmployee(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(salaryService.getSalariesByEmployee(employeeId));
    }

    @GetMapping("/{salaryId}")
    public ResponseEntity<Salaries> getSalaryById(@PathVariable Integer salaryId) {
        try {
            Salaries salary = salaryService.getSalaryById(salaryId);
            return ResponseEntity.ok(salary);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}