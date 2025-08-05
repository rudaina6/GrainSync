package com.plant_management.service;

import com.plant_management.entity.Employee;
import com.plant_management.repository.EmployeeRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getUnregisteredEmployees() {
        return employeeRepository.findEmployeesNotRegisteredAsUsers();
    }
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }

    public Optional<Employee> getEmployeeById(Integer id) {
        return employeeRepository.findById(id);
    }

    public Employee updateEmployee(Integer id, Employee updatedEmployee) {
        employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        updatedEmployee.setEmployee_id(id);
        return employeeRepository.save(updatedEmployee);
    }

    public List<Employee> getProductionEmployees() {
        return employeeRepository.findEmployeesInProduction();
    }

    public List<Employee> getSalesReps() {
        return employeeRepository.findSalesReps();
    }
}