package com.plant_management.service;

import com.plant_management.dto.RegisterUserFromEmployeeRequest;
import com.plant_management.entity.Employee;
import com.plant_management.entity.User;
import com.plant_management.repository.EmployeeRepository;
import com.plant_management.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public UserService(UserRepository userRepository, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long userId, User userDetails) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    existingUser.setUsername(userDetails.getUsername());
                    existingUser.setPassword(userDetails.getPassword());
                    existingUser.setRole(userDetails.getRole());
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Transactional
    public void registerUserFromEmployee(Integer empId, String username, String password) {
        if (!employeeRepository.existsById(empId)) {
            throw new IllegalArgumentException("Employee not found");
        }
        userRepository.registerUserFromEmployee(empId, username, password);
    }

    @Transactional
    public void makeUserAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(User.Role.admin);  // Make sure this enum matches your Role setup
        userRepository.save(user);
    }
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

}
