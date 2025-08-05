package com.plant_management.repository;

import com.plant_management.entity.Accountant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountantRepository extends JpaRepository<Accountant, Integer> {
}