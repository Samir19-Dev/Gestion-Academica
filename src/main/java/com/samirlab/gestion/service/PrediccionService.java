package com.samirlab.gestion.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.dto.PrediccionDTO;
import com.samirlab.gestion.entity.Asistencia;
import com.samirlab.gestion.entity.Estudiante;
import com.samirlab.gestion.entity.Nota;
import com.samirlab.gestion.repository.AsistenciaRepository;
import com.samirlab.gestion.repository.EstudianteRepository;
import com.samirlab.gestion.repository.NotaRepository;

@Service
@Transactional(readOnly = true)
public class PrediccionService {

    private final EstudianteRepository estudianteRepository;
    private final NotaRepository notaRepository;
    private final AsistenciaRepository asistenciaRepository;

    public PrediccionService(
            EstudianteRepository estudianteRepository,
            NotaRepository notaRepository,
            AsistenciaRepository asistenciaRepository) {
        this.estudianteRepository = estudianteRepository;
        this.notaRepository = notaRepository;
        this.asistenciaRepository = asistenciaRepository;
    }

    public List<PrediccionDTO> calcularRiesgo() {
        List<PrediccionDTO> lista = new ArrayList<>();

        List<Estudiante> estudiantes = estudianteRepository.findAll();

        for (Estudiante estudiante : estudiantes) {
            List<Nota> notas = notaRepository.findByInscripcionEstudianteId(estudiante.getId());
            List<Asistencia> asistencias = asistenciaRepository.findByInscripcionEstudianteId(estudiante.getId());

            double promedio = calcularPromedioNotas(notas);
            double porcentajeAsistencia = calcularPorcentajeAsistencia(asistencias);
            double probabilidad = calcularProbabilidadRiesgo(promedio, porcentajeAsistencia);
            String riesgo = calcularNivelRiesgo(probabilidad);

            PrediccionDTO dto = new PrediccionDTO();
            dto.setEstudianteId(estudiante.getId());
            dto.setEstudianteNombre(estudiante.getNombre());
            dto.setPromedio(redondear(promedio));
            dto.setPorcentajeAsistencia(redondear(porcentajeAsistencia));
            dto.setRiesgo(riesgo);
            dto.setProbabilidad(redondear(probabilidad));

            lista.add(dto);
        }

        return lista;
    }

    public List<PrediccionDTO> rankingRiesgo() {
        return calcularRiesgo().stream()
                .sorted((a, b) -> Double.compare(b.getProbabilidad(), a.getProbabilidad()))
                .limit(5)
                .toList();
    }

    private double calcularPromedioNotas(List<Nota> notas) {
        return notas.stream()
                .filter(n -> n.getPromedio() != null)
                .mapToDouble(n -> n.getPromedio().doubleValue())
                .average()
                .orElse(0.0);
    }

    private double calcularPorcentajeAsistencia(List<Asistencia> asistencias) {
        if (asistencias == null || asistencias.isEmpty()) {
            return 0.0;
        }

        long presentes = asistencias.stream()
                .filter(a -> a.getPresente() != null && a.getPresente())
                .count();

        return (presentes * 100.0) / asistencias.size();
    }

    private double calcularProbabilidadRiesgo(double promedio, double asistencia) {
        double riesgoPorNotas = (1 - (promedio / 5.0)) * 60.0;
        double riesgoPorAsistencia = (1 - (asistencia / 100.0)) * 40.0;
        double probabilidad = riesgoPorNotas + riesgoPorAsistencia;

        if (probabilidad < 0) {
            return 0.0;
        }

        if (probabilidad > 100) {
            return 100.0;
        }

        return probabilidad;
    }

    private String calcularNivelRiesgo(double probabilidad) {
        if (probabilidad >= 60) {
            return "ALTO";
        } else if (probabilidad >= 35) {
            return "MEDIO";
        } else {
            return "BAJO";
        }
    }

    private double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}