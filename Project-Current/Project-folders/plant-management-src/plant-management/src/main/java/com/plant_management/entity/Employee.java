package com.plant_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employee_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dept_id", referencedColumnName = "dept_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Department department;

    @Column(length = 50)
    private String first_name;

    @Column(length = 50)
    private String last_name;

    @Temporal(TemporalType.DATE)
    private Date date_of_birth;

    @Column(unique = true, length = 20)
    private String cnic;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 50)
    private String designation;

    @Column(length = 255)
    private String address;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer absences;

    @Column(nullable = false, columnDefinition = "int default 21")
    private Integer leaves;

    public enum Gender {
        male, female
    }

}