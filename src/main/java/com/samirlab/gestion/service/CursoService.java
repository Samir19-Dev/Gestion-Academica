package com.samirlab.gestion.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.dto.CursoResponseDTO;
import com.samirlab.gestion.entity.Curso;
import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.entity.Materia;
import com.samirlab.gestion.repository.CursoRepository;
import com.samirlab.gestion.repository.DocenteRepository;
import com.samirlab.gestion.repository.MateriaRepository;

import java.util.List;

@Service
@Transactional
public class CursoService {

    private final CursoRepository repository;
    private final DocenteRepository docenteRepository;
    private final MateriaRepository materiaRepository;
    private final DocenteAuthService docenteAuthService;
    private final UsuarioAuthService usuarioAuthService;

    public CursoService(CursoRepository repository,
                        DocenteRepository docenteRepository,
                        MateriaRepository materiaRepository,
                        DocenteAuthService docenteAuthService,
                        UsuarioAuthService usuarioAuthService) {
        this.repository = repository;
        this.docenteRepository = docenteRepository;
        this.materiaRepository = materiaRepository;
        this.docenteAuthService = docenteAuthService;
        this.usuarioAuthService = usuarioAuthService;
    }

    @Transactional(readOnly = true)
    public List<CursoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CursoResponseDTO> listarPorDocenteAutenticado(String username) {
        Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);
        return repository.findByDocenteId(docente.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CursoResponseDTO obtenerPorId(Long id, String username) {
        Curso curso = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con id: " + id));

        validarAccesoACurso(curso, username);

        return toResponseDTO(curso);
    }

    public CursoResponseDTO guardar(Long materiaId, Long docenteId, String grupo) {
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new EntityNotFoundException("Materia no encontrada con id: " + materiaId));

        Docente docente = docenteRepository.findById(docenteId)
                .orElseThrow(() -> new EntityNotFoundException("Docente no encontrado con id: " + docenteId));

        Curso curso = new Curso();
        curso.setMateria(materia);
        curso.setDocente(docente);
        curso.setGrupo(grupo);

        return toResponseDTO(repository.save(curso));
    }

    public CursoResponseDTO actualizar(Long id, Long materiaId, Long docenteId, String grupo) {
        Curso curso = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con id: " + id));

        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new EntityNotFoundException("Materia no encontrada con id: " + materiaId));

        Docente docente = docenteRepository.findById(docenteId)
                .orElseThrow(() -> new EntityNotFoundException("Docente no encontrado con id: " + docenteId));

        curso.setMateria(materia);
        curso.setDocente(docente);
        curso.setGrupo(grupo);

        return toResponseDTO(repository.save(curso));
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Curso no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }

    private void validarAccesoACurso(Curso curso, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            if (curso.getDocente() == null || curso.getDocente().getId() == null) {
                throw new RuntimeException("Curso sin docente asociado");
            }

            if (!docente.getId().equals(curso.getDocente().getId())) {
                throw new RuntimeException("No tienes permiso para acceder a este curso");
            }
        }
    }

    private CursoResponseDTO toResponseDTO(Curso curso) {
        return new CursoResponseDTO(
                curso.getId(),
                curso.getMateria() != null ? curso.getMateria().getId() : null,
                curso.getMateria() != null ? curso.getMateria().getNombre() : null,
                curso.getDocente() != null ? curso.getDocente().getId() : null,
                curso.getDocente() != null ? curso.getDocente().getNombre() : null,
                curso.getGrupo()
        );
    }
}