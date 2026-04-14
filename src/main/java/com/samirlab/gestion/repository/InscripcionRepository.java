package com.samirlab.gestion.repository;

import com.samirlab.gestion.entity.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    boolean existsByEstudianteIdAndCursoId(Long estudianteId, Long cursoId);

    List<Inscripcion> findByEstudianteId(Long estudianteId);

    List<Inscripcion> findByCursoDocenteId(Long docenteId);

    List<Inscripcion> findByCursoIdIn(List<Long> cursoIds);

    Optional<Inscripcion> findByEstudianteIdAndCursoId(Long estudianteId, Long cursoId);
}