package com.samirlab.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.samirlab.gestion.entity.Docente;

public interface DocenteRepository extends JpaRepository<Docente, Long> {
}
