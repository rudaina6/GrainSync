package com.plant_management.controller;

import com.plant_management.entity.Department;
import com.plant_management.entity.Employee;
import com.plant_management.repository.DepartmentRepository;
import com.plant_management.repository.EmployeeRepository;
import com.plant_management.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;
    private final DepartmentRepository departmentRepository;

    public EmployeeController(EmployeeService employeeService, DepartmentRepository departmentRepository,EmployeeRepository employeeRepository) {
        this.employeeService = employeeService;
        this.departmentRepository = departmentRepository;
        this.employeeRepository=employeeRepository;
    }

    @GetMapping("/production")
    public List<Employee> getProductionEmployees() {
        return employeeService.getProductionEmployees();
    }

    @GetMapping("/sales")
    public List<Employee> getSalesReps() {
        return employeeService.getSalesReps();
    }
    @GetMapping("/debug/unregistered-employees")
    public ResponseEntity<List<Employee>> debugUnregistered() {
        List<Employee> result = employeeRepository.findEmployeesNotRegisteredAsUsers();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/unregistered")
    public ResponseEntity<List<Employee>> getUnregisteredEmployees() {
        List<Employee> employees = employeeService.getUnregisteredEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @PostMapping
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee) {
        employee.setAbsences(0);
        employee.setLeaves(21);

        if (employee.getDepartment() != null && employee.getDepartment().getDept_id() != null) {
            Department department = departmentRepository.findById(employee.getDepartment().getDept_id())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Department ID"));
            employee.setDepartment(department);
        }

        Employee savedEmployee = employeeService.saveEmployee(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Integer id, @RequestBody Employee updatedEmployee) {
        try {
            if (updatedEmployee.getDepartment() != null && updatedEmployee.getDepartment().getDept_id() != null) {
                Department department = departmentRepository.findById(updatedEmployee.getDepartment().getDept_id())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid Department ID"));
                updatedEmployee.setDepartment(department);
            }
            Employee employee = employeeService.updateEmployee(id, updatedEmployee);
            return ResponseEntity.ok(employee);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update employee: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Integer id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        if (employee.isPresent()) {
            return ResponseEntity.ok(employee.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Employee deleted successfully");
    }
}
