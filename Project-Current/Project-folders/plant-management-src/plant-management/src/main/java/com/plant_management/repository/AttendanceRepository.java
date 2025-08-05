package com.plant_management.repository;

import com.plant_management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    @Query("SELECT a FROM Attendance a WHERE a.employee.employee_id = :employeeId AND a.date = :date")
    Optional<Attendance> findByEmployeeIdAndDate(Integer employeeId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.employee.employee_id = :employeeId")
    List<Attendance> findByEmployeeId(Integer employeeId);

    @Query("SELECT a FROM Attendance a WHERE a.date = :date")
    List<Attendance> findAllByDate(LocalDate date);
}