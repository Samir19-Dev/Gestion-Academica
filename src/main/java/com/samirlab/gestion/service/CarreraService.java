package com.samirlab.gestion.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.entity.Carrera;
import com.samirlab.gestion.repository.CarreraRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class CarreraService {

    private final CarreraRepository repository;

    public CarreraService(CarreraRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Carrera> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Carrera obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carrera no encontrada con id: " + id));
    }

    public Carrera guardar(Carrera carrera) {
        validar(carrera);

        String nombre = carrera.getNombre().trim();

        // 🔥 evitar duplicados
        if (repository.findAll().stream()
                .anyMatch(c -> c.getNombre().equalsIgnoreCase(nombre))) {
            throw new IllegalArgumentException("La carrera ya existe");
        }

        carrera.setNombre(nombre);
        return repository.save(carrera);
    }

    public Carrera actualizar(Long id, Carrera datos) {
        Carrera carrera = obtenerPorId(id);

        validar(datos);

        String nombre = datos.getNombre().trim();

        // 🔥 evitar duplicados en update
        boolean existe = repository.findAll().stream()
                .anyMatch(c -> !c.getId().equals(id)
                        && c.getNombre().equalsIgnoreCase(nombre));

        if (existe) {
            throw new IllegalArgumentException("La carrera ya existe");
        }

        carrera.setNombre(nombre);
        return repository.save(carrera);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Carrera no encontrada con id: " + id);
        }
        repository.deleteById(id);
    }

    private void validar(Carrera carrera) {
        if (carrera == null) {
            throw new IllegalArgumentException("La carrera es obligatoria");
        }

        if (carrera.getNombre() == null || carrera.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la carrera es obligatorio");
        }

        if (carrera.getNombre().trim().length() > 150) {
            throw new IllegalArgumentException("El nombre no puede superar 150 caracteres");
        }
    }
}

