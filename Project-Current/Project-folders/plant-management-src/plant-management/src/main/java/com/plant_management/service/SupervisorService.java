package com.plant_management.service;

import com.plant_management.entity.Supervisor;
import com.plant_management.repository.SupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupervisorService {

    @Autowired
    private SupervisorRepository supervisorRepository;

    public Supervisor createSupervisor(Supervisor supervisor) {
        return supervisorRepository.save(supervisor);
    }

    public Supervisor getSupervisorById(Integer id) {
        return supervisorRepository.findById(id).orElse(null);
    }

    public List<Supervisor> getAllSupervisors() {
        return supervisorRepository.findAll();
    }

    public Supervisor updateSupervisor(Integer id, Supervisor updatedSupervisor) {
        Optional<Supervisor> optional = supervisorRepository.findById(id);
        if (optional.isPresent()) {
            updatedSupervisor.setSupervisorId(id);
            return supervisorRepository.save(updatedSupervisor);
        } else {
            return null;
        }
    }

    public void deleteSupervisor(Integer id) {
        supervisorRepository.deleteById(id);
    }
}