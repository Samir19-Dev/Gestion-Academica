package com.samirlab.gestion.service;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.repository.DocenteRepository;

@Service
@Transactional
public class DocenteService {

    private final DocenteRepository repository;

    public DocenteService(DocenteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Docente> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Docente obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Docente no encontrado con id: " + id));
    }

    public Docente guardar(Docente docente) {
        validar(docente);
        docente.setNombre(docente.getNombre().trim());

        if (docente.getEspecialidad() != null) {
            docente.setEspecialidad(docente.getEspecialidad().trim());
        }

        return repository.save(docente);
    }

    public Docente actualizar(Long id, Docente datos) {
        Docente docente = obtenerPorId(id);

        docente.setNombre(datos.getNombre());
        docente.setEspecialidad(datos.getEspecialidad());

        validar(docente);

        docente.setNombre(docente.getNombre().trim());
        if (docente.getEspecialidad() != null) {
            docente.setEspecialidad(docente.getEspecialidad().trim());
        }

        return repository.save(docente);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Docente no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }

    private void validar(Docente docente) {
        if (docente.getNombre() == null || docente.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del docente es obligatorio");
        }

        if (docente.getNombre().trim().length() > 150) {
            throw new IllegalArgumentException("Nombre máximo 150 caracteres");
        }

        if (docente.getEspecialidad() != null && docente.getEspecialidad().trim().length() > 150) {
            throw new IllegalArgumentException("Especialidad máximo 150 caracteres");
        }
    }
}



