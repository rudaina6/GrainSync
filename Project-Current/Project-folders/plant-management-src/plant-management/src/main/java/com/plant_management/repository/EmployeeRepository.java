package com.plant_management.repository;

import com.plant_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    @Query("SELECT e FROM Employee e WHERE e.department.name = 'Production'")
    List<Employee> findEmployeesInProduction();

    @Query("SELECT e from Employee e WHERE e.designation = 'Sales Representative'")
    List<Employee> findSalesReps();

    @Query("SELECT e FROM Employee e WHERE e.employee_id NOT IN (SELECT u.employee.employee_id FROM User u)")
    List<Employee> findEmployeesNotRegisteredAsUsers();


}