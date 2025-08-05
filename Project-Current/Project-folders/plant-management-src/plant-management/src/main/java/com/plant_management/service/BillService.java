package com.plant_management.service;

import com.plant_management.dto.BillRequestDTO;
import com.plant_management.dto.BillResponseDTO;
import com.plant_management.entity.Accountant;
import com.plant_management.entity.Bill;
import com.plant_management.entity.Transaction;
import com.plant_management.repository.AccountantRepository;
import com.plant_management.repository.BillRepository;
import com.plant_management.repository.TransactionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {
    @PersistenceContext
    private EntityManager entityManager;

    private final BillRepository billRepository;
    private final TransactionRepository transactionRepository;
    private final AccountantRepository accountantRepository;

    public BillService(BillRepository billRepository,
                       TransactionRepository transactionRepository,
                       AccountantRepository accountantRepository) {
        this.billRepository = billRepository;
        this.transactionRepository = transactionRepository;
        this.accountantRepository = accountantRepository;
    }

    public List<BillResponseDTO> getAllBills() {
        return billRepository.findAllBillDetails();
    }

    @Transactional
    public void createBillViaProcedure(BillRequestDTO dto) {
        entityManager.createNativeQuery("CALL create_new_bill(?, ?, ?, ?, ?, ?)")
                .setParameter(1, dto.getAmount())
                .setParameter(2, dto.getAccountant_id())
                .setParameter(3, dto.getPayment_method())
                .setParameter(4, dto.getBill_type())
                .setParameter(5, dto.getIssue_date())
                .setParameter(6, dto.getDue_date())
                .executeUpdate();
    }

    public Optional<Bill> getBillById(Integer id) {
        return billRepository.findById(id);
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    public void deleteBill(Integer id) {
        billRepository.deleteById(id);
    }
}
