package com.samirlab.gestion.service;

import com.samirlab.gestion.dto.AsistenciaResponseDTO;
import com.samirlab.gestion.entity.Asistencia;
import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.entity.Inscripcion;
import com.samirlab.gestion.repository.AsistenciaRepository;
import com.samirlab.gestion.repository.InscripcionRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class AsistenciaService {

    private final AsistenciaRepository repository;
    private final InscripcionRepository inscripcionRepository;
    private final DocenteAuthService docenteAuthService;
    private final UsuarioAuthService usuarioAuthService;

    public AsistenciaService(AsistenciaRepository repository,
                             InscripcionRepository inscripcionRepository,
                             DocenteAuthService docenteAuthService,
                             UsuarioAuthService usuarioAuthService) {
        this.repository = repository;
        this.inscripcionRepository = inscripcionRepository;
        this.docenteAuthService = docenteAuthService;
        this.usuarioAuthService = usuarioAuthService;
    }

    public List<AsistenciaResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<AsistenciaResponseDTO> listarPorDocenteAutenticado(String username) {
        Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);
        return repository.findByInscripcionCursoDocenteId(docente.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public AsistenciaResponseDTO obtenerPorId(Long id, String username) {
        Asistencia asistencia = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Asistencia no encontrada"));

        validarAccesoAAsistencia(asistencia, username);

        return toResponseDTO(asistencia);
    }

    public List<Asistencia> listarPorEstudiante(Long estudianteId) {
        return repository.findByInscripcionEstudianteId(estudianteId);
    }

    public AsistenciaResponseDTO crear(Asistencia asistencia, String username) {
        validarAsistencia(asistencia);

        Inscripcion inscripcion = inscripcionRepository.findById(asistencia.getInscripcion().getId())
                .orElseThrow(() -> new EntityNotFoundException("Inscripción no encontrada"));

        validarAccesoAInscripcion(inscripcion, username);

        asistencia.setInscripcion(inscripcion);

        return toResponseDTO(repository.save(asistencia));
    }

    public AsistenciaResponseDTO actualizar(Long id, Asistencia asistencia, String username) {
        validarAsistencia(asistencia);

        Asistencia existente = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Asistencia no encontrada"));

        validarAccesoAAsistencia(existente, username);

        Inscripcion inscripcion = inscripcionRepository.findById(asistencia.getInscripcion().getId())
                .orElseThrow(() -> new EntityNotFoundException("Inscripción no encontrada"));

        validarAccesoAInscripcion(inscripcion, username);

        existente.setFecha(asistencia.getFecha());
        existente.setPresente(asistencia.getPresente());
        existente.setInscripcion(inscripcion);

        return toResponseDTO(repository.save(existente));
    }

    public void eliminar(Long id, String username) {
        Asistencia asistencia = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Asistencia no encontrada"));

        validarAccesoAAsistencia(asistencia, username);

        repository.delete(asistencia);
    }

    public List<AsistenciaResponseDTO> registrarAsistenciaDiaria(Long inscripcionId,
                                                                 LocalDate fecha,
                                                                 Boolean presente,
                                                                 String username) {
        if (repository.findByInscripcionIdAndFecha(inscripcionId, fecha).isPresent()) {
            throw new RuntimeException("Ya existe asistencia para esa fecha");
        }

        Inscripcion inscripcion = inscripcionRepository.findById(inscripcionId)
                .orElseThrow(() -> new RuntimeException("Inscripción no existe"));

        validarAccesoAInscripcion(inscripcion, username);

        Asistencia asistencia = new Asistencia();
        asistencia.setFecha(fecha);
        asistencia.setPresente(presente);
        asistencia.setInscripcion(inscripcion);

        return List.of(toResponseDTO(repository.save(asistencia)));
    }

    public Long contarPresentesEstudiante(Long estudianteId) {
        return repository.findByInscripcionEstudianteId(estudianteId)
                .stream()
                .filter(a -> Boolean.TRUE.equals(a.getPresente()))
                .count();
    }

    private void validarAccesoAAsistencia(Asistencia asistencia, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            Long docenteAsistencia = asistencia.getInscripcion()
                    .getCurso()
                    .getDocente()
                    .getId();

            if (!docente.getId().equals(docenteAsistencia)) {
                throw new RuntimeException("No tienes permiso para acceder a esta asistencia");
            }
        }
    }

    private void validarAccesoAInscripcion(Inscripcion inscripcion, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            Long docenteCurso = inscripcion.getCurso()
                    .getDocente()
                    .getId();

            if (!docente.getId().equals(docenteCurso)) {
                throw new RuntimeException("No tienes permiso para gestionar asistencias de esta inscripción");
            }
        }
    }

    private void validarAsistencia(Asistencia asistencia) {
        if (asistencia.getFecha() == null) {
            throw new IllegalArgumentException("Fecha obligatoria");
        }
        if (asistencia.getInscripcion() == null || asistencia.getInscripcion().getId() == null) {
            throw new IllegalArgumentException("Inscripción obligatoria");
        }
    }

    private AsistenciaResponseDTO toResponseDTO(Asistencia a) {
        String descripcion = "Sin inscripción";

        if (a.getInscripcion() != null) {
            String estudiante = a.getInscripcion().getEstudiante() != null
                    ? a.getInscripcion().getEstudiante().getNombre()
                    : "Sin estudiante";

            String materia = a.getInscripcion().getCurso() != null &&
                    a.getInscripcion().getCurso().getMateria() != null
                    ? a.getInscripcion().getCurso().getMateria().getNombre()
                    : "Sin materia";

            String grupo = a.getInscripcion().getCurso() != null
                    ? a.getInscripcion().getCurso().getGrupo()
                    : "Sin grupo";

            descripcion = estudiante + " - " + materia + " - Grupo " + grupo;
        }

        return new AsistenciaResponseDTO(
                a.getId(),
                a.getFecha(),
                a.getPresente(),
                a.getInscripcion() != null ? a.getInscripcion().getId() : null,
                descripcion
        );
    }
}