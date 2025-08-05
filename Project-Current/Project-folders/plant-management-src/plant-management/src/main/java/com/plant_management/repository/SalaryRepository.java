package com.plant_management.repository;

import com.plant_management.entity.Salaries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salaries, Integer> {

    @Query("SELECT s FROM Salaries s WHERE s.employee.employee_id = :employeeId AND s.transaction.date_of_transaction = :date")
    Optional<Salaries> findByEmployeeIdAndDate(Integer employeeId, Date date);

    @Query("SELECT s FROM Salaries s WHERE s.transaction.date_of_transaction = :date")
    List<Salaries> findAllByDate(Date date);

    @Query("SELECT s FROM Salaries s WHERE s.employee.employee_id = :employeeId")
    List<Salaries> findAllByEmployeeId(Integer employeeId);
}