package com.plant_management.repository;

import com.plant_management.entity.OrdersProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersProductsRepository extends JpaRepository<OrdersProducts, Integer> {
    @Query("SELECT op FROM OrdersProducts op WHERE op.order_id = :orderId")
    List<OrdersProducts> findByOrderId(@Param("orderId") int orderId);
}