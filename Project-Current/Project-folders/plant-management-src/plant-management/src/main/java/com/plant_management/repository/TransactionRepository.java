package com.plant_management.repository;

import com.plant_management.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    @Modifying
    @Query(value = "DELETE FROM transactions WHERE transaction_id = :transactionId", nativeQuery = true)
    void deleteByTransactionId(@Param("transactionId") int transactionId);
}
