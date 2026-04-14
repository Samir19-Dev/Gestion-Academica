package com.samirlab.gestion.service;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.dto.EstudianteRequestDTO;
import com.samirlab.gestion.dto.EstudianteResponseDTO;
import com.samirlab.gestion.entity.Carrera;
import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.entity.Estudiante;
import com.samirlab.gestion.entity.Inscripcion;
import com.samirlab.gestion.repository.CarreraRepository;
import com.samirlab.gestion.repository.EstudianteRepository;
import com.samirlab.gestion.repository.InscripcionRepository;

@Service
@Transactional
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final CarreraRepository carreraRepository;
    private final InscripcionRepository inscripcionRepository;
    private final DocenteAuthService docenteAuthService;
    private final UsuarioAuthService usuarioAuthService;

    public EstudianteService(
            EstudianteRepository estudianteRepository,
            CarreraRepository carreraRepository,
            InscripcionRepository inscripcionRepository,
            DocenteAuthService docenteAuthService,
            UsuarioAuthService usuarioAuthService) {
        this.estudianteRepository = estudianteRepository;
        this.carreraRepository = carreraRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.docenteAuthService = docenteAuthService;
        this.usuarioAuthService = usuarioAuthService;
    }

    @Transactional(readOnly = true)
    public List<EstudianteResponseDTO> listarTodos() {
        return estudianteRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EstudianteResponseDTO> listarPorDocenteAutenticado(String username) {
        Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

        return inscripcionRepository.findByCursoDocenteId(docente.getId())
                .stream()
                .map(Inscripcion::getEstudiante)
                .filter(estudiante -> estudiante != null)
                .distinct()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public EstudianteResponseDTO obtenerPorId(Long id, String username) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado con id: " + id));

        validarAccesoAEstudiante(estudiante, username);

        return toResponseDTO(estudiante);
    }

    public EstudianteResponseDTO guardar(EstudianteRequestDTO dto) {
        validar(dto);

        Carrera carrera = carreraRepository.findById(dto.getCarreraId())
                .orElseThrow(() -> new EntityNotFoundException("Carrera no encontrada con id: " + dto.getCarreraId()));

        Estudiante estudiante = new Estudiante();
        estudiante.setNombre(dto.getNombre().trim());
        estudiante.setSemestre(dto.getSemestre());
        estudiante.setCarrera(carrera);

        return toResponseDTO(estudianteRepository.save(estudiante));
    }

    public EstudianteResponseDTO actualizar(Long id, EstudianteRequestDTO dto) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado con id: " + id));

        validar(dto);

        Carrera carrera = carreraRepository.findById(dto.getCarreraId())
                .orElseThrow(() -> new EntityNotFoundException("Carrera no encontrada con id: " + dto.getCarreraId()));

        estudiante.setNombre(dto.getNombre().trim());
        estudiante.setSemestre(dto.getSemestre());
        estudiante.setCarrera(carrera);

        return toResponseDTO(estudianteRepository.save(estudiante));
    }

    public void eliminar(Long id) {
        if (!estudianteRepository.existsById(id)) {
            throw new EntityNotFoundException("Estudiante no encontrado con id: " + id);
        }
        estudianteRepository.deleteById(id);
    }

    private void validarAccesoAEstudiante(Estudiante estudiante, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            boolean pertenece = inscripcionRepository.findByCursoDocenteId(docente.getId())
                    .stream()
                    .map(Inscripcion::getEstudiante)
                    .filter(e -> e != null)
                    .anyMatch(e -> e.getId().equals(estudiante.getId()));

            if (!pertenece) {
                throw new RuntimeException("No tienes permiso para acceder a este estudiante");
            }
        }
    }

    private void validar(EstudianteRequestDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del estudiante es obligatorio");
        }

        if (dto.getNombre().trim().length() > 100) {
            throw new IllegalArgumentException("El nombre no puede superar 100 caracteres");
        }

        if (dto.getCarreraId() == null) {
            throw new IllegalArgumentException("La carrera es obligatoria");
        }

        validarSemestre(dto.getSemestre());
    }

    private void validarSemestre(Integer semestre) {
        if (semestre == null || semestre < 1 || semestre > 10) {
            throw new IllegalArgumentException("Semestre debe estar entre 1 y 10");
        }
    }

    private EstudianteResponseDTO toResponseDTO(Estudiante e) {
        return new EstudianteResponseDTO(
                e.getId(),
                e.getNombre(),
                e.getSemestre(),
                e.getCarrera() != null ? e.getCarrera().getId() : null,
                e.getCarrera() != null ? e.getCarrera().getNombre() : null
        );
    }
}