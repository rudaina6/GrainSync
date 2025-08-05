package com.plant_management.service;

import com.plant_management.entity.Transaction;
import com.plant_management.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }

    public Optional<Transaction> getTransactionById(Integer id) {
        return repository.findById(id);
    }

    public Transaction updateTransaction(Integer id, Transaction updatedTransaction) {
        Optional<Transaction> optionalTransaction = repository.findById(id);
        if (optionalTransaction.isPresent()) {
            updatedTransaction.setTransaction_id(id);
            return repository.save(updatedTransaction);
        } else {
            return null;
        }
    }

    public Transaction createTransaction(Transaction transaction) {
        return repository.save(transaction);
    }

    public void deleteTransaction(Integer id) {
        repository.deleteById(id);
    }
}
