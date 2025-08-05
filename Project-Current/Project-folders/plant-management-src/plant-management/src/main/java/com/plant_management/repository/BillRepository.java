package com.plant_management.repository;

import com.plant_management.dto.BillResponseDTO;
import com.plant_management.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("SELECT new com.plant_management.dto.BillResponseDTO( " +
            "b.bill_id, b.transaction.amount, b.issue_date, b.due_date, b.bill_type, b.transaction.payment_method) " +
            "FROM Bill b")
    List<BillResponseDTO> findAllBillDetails();

}