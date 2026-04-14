package com.samirlab.gestion.service;

import com.samirlab.gestion.dto.InscripcionResponseDTO;
import com.samirlab.gestion.entity.Curso;
import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.entity.Estudiante;
import com.samirlab.gestion.entity.Inscripcion;
import com.samirlab.gestion.repository.CursoRepository;
import com.samirlab.gestion.repository.EstudianteRepository;
import com.samirlab.gestion.repository.InscripcionRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final EstudianteRepository estudianteRepository;
    private final CursoRepository cursoRepository;
    private final DocenteAuthService docenteAuthService;
    private final UsuarioAuthService usuarioAuthService;

    public InscripcionService(InscripcionRepository inscripcionRepository,
                              EstudianteRepository estudianteRepository,
                              CursoRepository cursoRepository,
                              DocenteAuthService docenteAuthService,
                              UsuarioAuthService usuarioAuthService) {
        this.inscripcionRepository = inscripcionRepository;
        this.estudianteRepository = estudianteRepository;
        this.cursoRepository = cursoRepository;
        this.docenteAuthService = docenteAuthService;
        this.usuarioAuthService = usuarioAuthService;
    }

    @Transactional(readOnly = true)
    public List<InscripcionResponseDTO> listar() {
        return inscripcionRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InscripcionResponseDTO> listarPorDocenteAutenticado(String username) {
        Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);
        return inscripcionRepository.findByCursoDocenteId(docente.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public InscripcionResponseDTO obtener(Long id, String username) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inscripción no encontrada"));

        validarAccesoAInscripcion(inscripcion, username);

        return toResponseDTO(inscripcion);
    }

    public InscripcionResponseDTO crear(Inscripcion inscripcion) {
        Estudiante estudiante = estudianteRepository
                .findById(inscripcion.getEstudiante().getId())
                .orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado"));

        Curso curso = cursoRepository
                .findById(inscripcion.getCurso().getId())
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        boolean existe = inscripcionRepository
                .existsByEstudianteIdAndCursoId(estudiante.getId(), curso.getId());

        if (existe) {
            throw new RuntimeException("El estudiante ya está inscrito en este curso");
        }

        inscripcion.setEstudiante(estudiante);
        inscripcion.setCurso(curso);

        return toResponseDTO(inscripcionRepository.save(inscripcion));
    }

    public InscripcionResponseDTO actualizar(Long id, Inscripcion inscripcion) {
        Inscripcion existente = inscripcionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inscripción no encontrada"));

        Estudiante estudiante = estudianteRepository
                .findById(inscripcion.getEstudiante().getId())
                .orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado"));

        Curso curso = cursoRepository
                .findById(inscripcion.getCurso().getId())
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        inscripcionRepository.findByEstudianteIdAndCursoId(estudiante.getId(), curso.getId())
                .ifPresent(otra -> {
                    if (!otra.getId().equals(id)) {
                        throw new RuntimeException("El estudiante ya está inscrito en este curso");
                    }
                });

        existente.setEstudiante(estudiante);
        existente.setCurso(curso);

        return toResponseDTO(inscripcionRepository.save(existente));
    }

    public void eliminar(Long id) {
        if (!inscripcionRepository.existsById(id)) {
            throw new EntityNotFoundException("Inscripción no encontrada");
        }
        inscripcionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Curso> cursosDisponibles(Long estudianteId) {
        List<Inscripcion> inscritas = inscripcionRepository.findByEstudianteId(estudianteId);

        List<Long> cursosInscritosIds = inscritas.stream()
                .map(i -> i.getCurso().getId())
                .toList();

        List<Curso> todos = cursoRepository.findAll();

        return todos.stream()
                .filter(c -> !cursosInscritosIds.contains(c.getId()))
                .toList();
    }

    private void validarAccesoAInscripcion(Inscripcion inscripcion, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            if (inscripcion.getCurso() == null ||
                inscripcion.getCurso().getDocente() == null ||
                inscripcion.getCurso().getDocente().getId() == null) {
                throw new RuntimeException("Inscripción sin curso/docente asociado");
            }

            if (!docente.getId().equals(inscripcion.getCurso().getDocente().getId())) {
                throw new RuntimeException("No tienes permiso para acceder a esta inscripción");
            }
        }
    }

    private InscripcionResponseDTO toResponseDTO(Inscripcion i) {
        return new InscripcionResponseDTO(
                i.getId(),
                i.getEstudiante() != null ? i.getEstudiante().getId() : null,
                i.getEstudiante() != null ? i.getEstudiante().getNombre() : null,
                i.getCurso() != null ? i.getCurso().getId() : null,
                i.getCurso() != null && i.getCurso().getMateria() != null ? i.getCurso().getMateria().getNombre() : null,
                i.getCurso() != null ? i.getCurso().getGrupo() : null,
                i.getCurso() != null && i.getCurso().getDocente() != null ? i.getCurso().getDocente().getId() : null,
                i.getCurso() != null && i.getCurso().getDocente() != null ? i.getCurso().getDocente().getNombre() : null
        );
    }
}