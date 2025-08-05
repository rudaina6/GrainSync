package com.plant_management.repository;

import com.plant_management.entity.Delivery;
import com.plant_management.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {

    List<Delivery> findByDeliveryTimeIsNull();

    List<Delivery> findByDeliveryTimeIsNotNull();

    boolean existsByOrder(Order order);
}