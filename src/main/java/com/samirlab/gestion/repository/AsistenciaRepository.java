package com.samirlab.gestion.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.samirlab.gestion.entity.Asistencia;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByInscripcionEstudianteId(Long estudianteId);

    Optional<Asistencia> findByInscripcionIdAndFecha(Long inscripcionId, LocalDate fecha);

    List<Asistencia> findByInscripcionCursoDocenteId(Long docenteId);
}