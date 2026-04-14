package com.samirlab.gestion.controller;

import com.samirlab.gestion.entity.Carrera;
import com.samirlab.gestion.repository.CarreraRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carreras")
public class CarreraController {

    private final CarreraRepository carreraRepository;

    public CarreraController(CarreraRepository carreraRepository) {
        this.carreraRepository = carreraRepository;
    }

    @GetMapping
    public ResponseEntity<List<Carrera>> listar() {
        return ResponseEntity.ok(carreraRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return carreraRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Carrera no encontrada con id: " + id));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Carrera carrera) {
        if (carrera.getNombre() == null || carrera.getNombre().isBlank()) {
            return ResponseEntity.badRequest().body("El nombre de la carrera es obligatorio");
        }

        String nombre = carrera.getNombre().trim();

        boolean existe = carreraRepository.findAll().stream()
                .anyMatch(c -> c.getNombre() != null && c.getNombre().equalsIgnoreCase(nombre));

        if (existe) {
            return ResponseEntity.badRequest().body("La carrera ya existe");
        }

        carrera.setNombre(nombre);
        return ResponseEntity.status(HttpStatus.CREATED).body(carreraRepository.save(carrera));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Carrera carreraActualizada) {
        return carreraRepository.findById(id)
                .<ResponseEntity<?>>map(carrera -> {
                    if (carreraActualizada.getNombre() == null || carreraActualizada.getNombre().isBlank()) {
                        return ResponseEntity.badRequest().body("El nombre de la carrera es obligatorio");
                    }

                    String nombre = carreraActualizada.getNombre().trim();

                    boolean existe = carreraRepository.findAll().stream()
                            .anyMatch(c -> !c.getId().equals(id)
                                    && c.getNombre() != null
                                    && c.getNombre().equalsIgnoreCase(nombre));

                    if (existe) {
                        return ResponseEntity.badRequest().body("La carrera ya existe");
                    }

                    carrera.setNombre(nombre);
                    return ResponseEntity.ok(carreraRepository.save(carrera));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Carrera no encontrada con id: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return carreraRepository.findById(id)
                .<ResponseEntity<?>>map(carrera -> {
                    carreraRepository.delete(carrera);
                    return ResponseEntity.ok("Carrera eliminada correctamente");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Carrera no encontrada con id: " + id));
    }
}