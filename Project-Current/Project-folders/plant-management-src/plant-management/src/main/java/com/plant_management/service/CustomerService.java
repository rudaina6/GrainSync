package com.plant_management.service;

import com.plant_management.entity.Customer;
import com.plant_management.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(int id) {
        return customerRepository.findById(id).orElse(null);
    }

    public Customer updateCustomer(int id, Customer updatedCustomer) {
        updatedCustomer.setCustomer_id(id);
        return customerRepository.save(updatedCustomer);
    }

    public void deleteCustomer(int id) {
        customerRepository.deleteById(id);
    }
}