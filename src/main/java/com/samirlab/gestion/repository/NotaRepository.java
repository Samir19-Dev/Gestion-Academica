package com.samirlab.gestion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.samirlab.gestion.entity.Nota;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    Optional<Nota> findByInscripcionId(Long inscripcionId);

    List<Nota> findByInscripcionEstudianteId(Long estudianteId);

    List<Nota> findByInscripcionCursoDocenteId(Long docenteId);
}