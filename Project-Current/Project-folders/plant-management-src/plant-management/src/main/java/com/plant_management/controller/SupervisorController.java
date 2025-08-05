package com.plant_management.controller;

import com.plant_management.entity.Supervisor;
import com.plant_management.service.SupervisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supervisors")
public class SupervisorController {

    @Autowired
    private SupervisorService supervisorService;

    @PostMapping
    public ResponseEntity<Supervisor> createSupervisor(@RequestBody Supervisor supervisor) {
        return ResponseEntity.ok(supervisorService.createSupervisor(supervisor));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supervisor> getSupervisorById(@PathVariable Integer id) {
        Supervisor supervisor = supervisorService.getSupervisorById(id);
        return supervisor != null ? ResponseEntity.ok(supervisor) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Supervisor>> getAllSupervisors() {
        return ResponseEntity.ok(supervisorService.getAllSupervisors());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supervisor> updateSupervisor(@PathVariable Integer id, @RequestBody Supervisor supervisor) {
        Supervisor updated = supervisorService.updateSupervisor(id, supervisor);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupervisor(@PathVariable Integer id) {
        supervisorService.deleteSupervisor(id);
        return ResponseEntity.noContent().build();
    }
}