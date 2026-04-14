package com.samirlab.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.samirlab.gestion.entity.Materia;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
}
