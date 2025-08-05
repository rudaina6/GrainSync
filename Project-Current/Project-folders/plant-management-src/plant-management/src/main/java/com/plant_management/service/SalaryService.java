package com.plant_management.service;

import com.plant_management.entity.Employee;
import com.plant_management.entity.Salaries;
import com.plant_management.entity.Transaction;
import com.plant_management.repository.EmployeeRepository;
import com.plant_management.repository.SalaryRepository;
import com.plant_management.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SalaryService {

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountantService accountantService;

    @Transactional
    public Salaries createSalary(Integer employeeId, Date date, BigDecimal baseAmount, BigDecimal bonus, BigDecimal fine, Integer accountantId, String paymentMethod) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Optional<Salaries> existingSalary = salaryRepository.findByEmployeeIdAndDate(employeeId, date);
        if (existingSalary.isPresent()) {
            throw new RuntimeException("Salary already exists for this date");
        }

        var accountant = accountantService.getAccountantById(accountantId)
                .orElseThrow(() -> new RuntimeException("Accountant not found"));

        Transaction transaction = new Transaction();
        transaction.setAmount(baseAmount);
        transaction.setType(Transaction.TransactionType.withdrawal);
        transaction.setDate_of_transaction(date);
        transaction.setPayment_method(paymentMethod);
        transaction.setAccountant(accountant);
        transaction = transactionRepository.save(transaction);

        Salaries salary = new Salaries();
        salary.setEmployee(employee);
        salary.setTransaction(transaction);
        salary.setBonus(bonus);
        salary.setFine(fine);

        return salaryRepository.save(salary);
    }

    @Transactional
    public Salaries updateSalary(Integer salaryId, BigDecimal bonus, BigDecimal fine) {
        log.info("Starting salary update for ID: {}", salaryId);

        try {
            Salaries salary = salaryRepository.findById(salaryId)
                    .orElseThrow(() -> new RuntimeException("Salary record not found"));
            log.info("Found salary record: {}", salary);

            Transaction transaction = salary.getTransaction();
            if (transaction == null) {
                throw new RuntimeException("No transaction found for salary ID: " + salaryId);
            }
            log.info("Found transaction: {}", transaction);

            BigDecimal originalBaseAmount = transaction.getAmount().subtract(salary.getBonus()).add(salary.getFine());
            log.info("Original base amount: {}", originalBaseAmount);

            BigDecimal newTotalAmount = originalBaseAmount.add(bonus).subtract(fine);
            log.info("Calculated new total amount: {}", newTotalAmount);

            transaction.setAmount(newTotalAmount);
            Transaction savedTransaction = transactionRepository.save(transaction);
            log.info("Saved transaction with new amount: {}", savedTransaction.getAmount());

            salary.setBonus(bonus);
            salary.setFine(fine);
            Salaries savedSalary = salaryRepository.save(salary);
            log.info("Saved salary with new values - Bonus: {}, Fine: {}", savedSalary.getBonus(), savedSalary.getFine());

            return savedSalary;
        } catch (Exception e) {
            log.error("Error updating salary: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Salaries> getAllSalaries() {
        return salaryRepository.findAll();
    }

    public List<Salaries> getSalariesByDate(Date date) {
        return salaryRepository.findAllByDate(date);
    }

    public List<Salaries> getSalariesByEmployee(Integer employeeId) {
        return salaryRepository.findAllByEmployeeId(employeeId);
    }

    public Salaries getSalaryById(Integer salaryId) {
        return salaryRepository.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary record not found"));
    }
}