package com.plant_management.controller;

import com.plant_management.entity.Delivery;
import com.plant_management.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Integer id) {
        return deliveryService.getDeliveryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Delivery createDelivery(@RequestBody Delivery delivery) {
        return deliveryService.createDelivery(delivery);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(@PathVariable Integer id, @RequestBody Delivery deliveryDetails) {
        try {
            Delivery updatedDelivery = deliveryService.updateDelivery(id, deliveryDetails);
            return ResponseEntity.ok(updatedDelivery);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> markDeliveryAsCompleted(@PathVariable Integer id) {
        try {
            deliveryService.markDeliveryAsCompleted(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<String> cancelDelivery(@PathVariable Integer id) {
        try {
            deliveryService.cancelDelivery(id);
            return ResponseEntity.ok("Delivery cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error cancelling delivery: " + e.getMessage());
        }
    }

    @GetMapping("/pending")
    public List<Delivery> getPendingDeliveries() {
        return deliveryService.getPendingDeliveries();
    }

    @GetMapping("/completed")
    public List<Delivery> getCompletedDeliveries() {
        return deliveryService.getCompletedDeliveries();
    }
}