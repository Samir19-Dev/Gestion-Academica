package com.samirlab.gestion.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.samirlab.gestion.entity.Curso;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    List<Curso> findByDocenteId(Long docenteId);
}