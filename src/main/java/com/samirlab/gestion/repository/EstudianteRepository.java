package com.samirlab.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.samirlab.gestion.entity.Estudiante;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
}
