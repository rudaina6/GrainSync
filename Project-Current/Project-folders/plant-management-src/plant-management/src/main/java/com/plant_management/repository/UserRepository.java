package com.plant_management.repository;

import com.plant_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByUsername(String username);
        @Procedure(procedureName = "register_user_from_employee")
        void registerUserFromEmployee(@Param("emp_id") Integer empId,
                                      @Param("uname") String username,
                                      @Param("pwd") String password);
        boolean existsByUsername(String username);

}
