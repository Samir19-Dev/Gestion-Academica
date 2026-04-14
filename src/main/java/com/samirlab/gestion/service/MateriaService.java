package com.samirlab.gestion.service;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.dto.MateriaResponseDTO;
import com.samirlab.gestion.entity.Curso;
import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.entity.Materia;
import com.samirlab.gestion.repository.CursoRepository;
import com.samirlab.gestion.repository.MateriaRepository;

@Service
@Transactional
public class MateriaService {

    private final MateriaRepository repository;
    private final CursoRepository cursoRepository;
    private final DocenteAuthService docenteAuthService;
    private final UsuarioAuthService usuarioAuthService;

    public MateriaService(MateriaRepository repository,
                          CursoRepository cursoRepository,
                          DocenteAuthService docenteAuthService,
                          UsuarioAuthService usuarioAuthService) {
        this.repository = repository;
        this.cursoRepository = cursoRepository;
        this.docenteAuthService = docenteAuthService;
        this.usuarioAuthService = usuarioAuthService;
    }

    @Transactional(readOnly = true)
    public List<MateriaResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MateriaResponseDTO> listarPorDocenteAutenticado(String username) {
        Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

        return cursoRepository.findByDocenteId(docente.getId())
                .stream()
                .map(Curso::getMateria)
                .filter(materia -> materia != null)
                .distinct()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public MateriaResponseDTO obtenerPorId(Long id, String username) {
        Materia materia = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Materia no encontrada con id: " + id));

        validarAccesoAMateria(materia, username);

        return toResponseDTO(materia);
    }

    public MateriaResponseDTO guardar(Materia materia) {
        validarMateria(materia);
        return toResponseDTO(repository.save(materia));
    }

    public MateriaResponseDTO actualizar(Long id, Materia materia) {
        Materia existente = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Materia no encontrada con id: " + id));

        validarMateria(materia);

        existente.setNombre(materia.getNombre().trim());
        existente.setCreditos(materia.getCreditos());

        return toResponseDTO(repository.save(existente));
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Materia no encontrada con id: " + id);
        }
        repository.deleteById(id);
    }

    private void validarAccesoAMateria(Materia materia, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            boolean pertenece = cursoRepository.findByDocenteId(docente.getId())
                    .stream()
                    .map(Curso::getMateria)
                    .filter(m -> m != null)
                    .anyMatch(m -> m.getId().equals(materia.getId()));

            if (!pertenece) {
                throw new RuntimeException("No tienes permiso para acceder a esta materia");
            }
        }
    }

    private void validarMateria(Materia materia) {
        if (materia.getNombre() == null || materia.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la materia es obligatorio");
        }

        if (materia.getCreditos() == null || materia.getCreditos() <= 0) {
            throw new IllegalArgumentException("Los créditos deben ser mayores a 0");
        }

        materia.setNombre(materia.getNombre().trim());
    }

    private MateriaResponseDTO toResponseDTO(Materia materia) {
        return new MateriaResponseDTO(
                materia.getId(),
                materia.getNombre(),
                materia.getCreditos()
        );
    }
}