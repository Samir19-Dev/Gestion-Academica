package com.samirlab.gestion.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.dto.DashboardDTO;
import com.samirlab.gestion.entity.Asistencia;
import com.samirlab.gestion.entity.Nota;
import com.samirlab.gestion.repository.AsistenciaRepository;
import com.samirlab.gestion.repository.CursoRepository;
import com.samirlab.gestion.repository.DocenteRepository;
import com.samirlab.gestion.repository.EstudianteRepository;
import com.samirlab.gestion.repository.InscripcionRepository;
import com.samirlab.gestion.repository.MateriaRepository;
import com.samirlab.gestion.repository.NotaRepository;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final MateriaRepository materiaRepository;
    private final CursoRepository cursoRepository;
    private final InscripcionRepository inscripcionRepository;
    private final NotaRepository notaRepository;
    private final AsistenciaRepository asistenciaRepository;

    public DashboardService(
            EstudianteRepository estudianteRepository,
            DocenteRepository docenteRepository,
            MateriaRepository materiaRepository,
            CursoRepository cursoRepository,
            InscripcionRepository inscripcionRepository,
            NotaRepository notaRepository,
            AsistenciaRepository asistenciaRepository) {
        this.estudianteRepository = estudianteRepository;
        this.docenteRepository = docenteRepository;
        this.materiaRepository = materiaRepository;
        this.cursoRepository = cursoRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.notaRepository = notaRepository;
        this.asistenciaRepository = asistenciaRepository;
    }

    public DashboardDTO obtenerResumen() {
        DashboardDTO dto = new DashboardDTO();

        dto.setEstudiantes(estudianteRepository.count());
        dto.setDocentes(docenteRepository.count());
        dto.setMaterias(materiaRepository.count());
        dto.setCursos(cursoRepository.count());
        dto.setInscripciones(inscripcionRepository.count());
        dto.setNotas(notaRepository.count());
        dto.setAsistencias(asistenciaRepository.count());

        dto.setPromedioAsistencia(calcularPromedioAsistencia());
        dto.setEstudiantesAprobados(calcularEstudiantesAprobados());

        return dto;
    }

    private BigDecimal calcularPromedioAsistencia() {
        List<Asistencia> asistencias = asistenciaRepository.findAll();

        if (asistencias.isEmpty()) {
            return BigDecimal.ZERO;
        }

        long presentes = asistencias.stream()
                .filter(a -> Boolean.TRUE.equals(a.getPresente()))
                .count();

        double porcentaje = (presentes * 100.0) / asistencias.size();

        return BigDecimal.valueOf(porcentaje).setScale(2, RoundingMode.HALF_UP);
    }

    private Long calcularEstudiantesAprobados() {
        List<Nota> notas = notaRepository.findAll();

        return notas.stream()
                .filter(n -> n.getPromedio() != null)
                .filter(n -> n.getPromedio().compareTo(BigDecimal.valueOf(3.0)) >= 0)
                .map(n -> n.getInscripcion().getEstudiante().getId())
                .distinct()
                .count();
    }
}

