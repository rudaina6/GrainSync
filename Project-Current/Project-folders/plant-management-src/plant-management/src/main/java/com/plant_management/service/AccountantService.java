package com.plant_management.service;

import com.plant_management.entity.Accountant;
import com.plant_management.repository.AccountantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountantService {

    @Autowired
    private AccountantRepository accountantRepository;

    public List<Accountant> getAllAccountants() {
        return accountantRepository.findAll();
    }

    public Optional<Accountant> getAccountantById(int id) {
        return accountantRepository.findById(id);
    }

    public Accountant saveAccountant(Accountant accountant) {
        return accountantRepository.save(accountant);
    }

    public void deleteAccountant(int id) {
        accountantRepository.deleteById(id);
    }
}