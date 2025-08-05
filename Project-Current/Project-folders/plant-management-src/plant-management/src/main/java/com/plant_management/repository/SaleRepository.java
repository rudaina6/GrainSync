package com.plant_management.repository;

import com.plant_management.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
    @Query("SELECT s FROM Sale s WHERE s.order_id = :orderId")
    List<Sale> findByOrderId(@Param("orderId") int orderId);
    
    @Modifying
    @Query(value = "DELETE FROM sales WHERE order_id = :orderId", nativeQuery = true)
    void deleteByOrderId(@Param("orderId") int orderId);
}
