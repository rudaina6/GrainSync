package com.plant_management.entity;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountantId implements Serializable {

    private Integer accountant_id;
    private Integer employee_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AccountantId)) return false;
        AccountantId that = (AccountantId) o;
        return Objects.equals(accountant_id, that.accountant_id) &&
                Objects.equals(employee_id, that.employee_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(accountant_id, employee_id);
    }
}
