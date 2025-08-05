package com.plant_management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
@Getter
@Setter
public class RegisterUserFromEmployeeRequest {
    @JsonProperty("employee_id")
    private Integer employee_id;
    private String username;
    private String password;
}