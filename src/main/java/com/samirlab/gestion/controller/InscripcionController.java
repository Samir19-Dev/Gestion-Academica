package com.samirlab.gestion.controller;

import com.samirlab.gestion.dto.InscripcionResponseDTO;
import com.samirlab.gestion.entity.Curso;
import com.samirlab.gestion.entity.Inscripcion;
import com.samirlab.gestion.service.InscripcionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    private final InscripcionService service;

    public InscripcionController(InscripcionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<InscripcionResponseDTO>> listar(Principal principal) {
        String role = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        if ("ROLE_DOCENTE".equals(role)) {
            return ResponseEntity.ok(service.listarPorDocenteAutenticado(principal.getName()));
        }

        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InscripcionResponseDTO> obtener(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(service.obtener(id, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<InscripcionResponseDTO> crear(@RequestBody Inscripcion inscripcion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(inscripcion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InscripcionResponseDTO> actualizar(@PathVariable Long id, @RequestBody Inscripcion inscripcion) {
        return ResponseEntity.ok(service.actualizar(id, inscripcion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok("Inscripción eliminada correctamente");
    }

    @GetMapping("/cursos-disponibles/{estudianteId}")
    public ResponseEntity<List<Curso>> cursosDisponibles(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(service.cursosDisponibles(estudianteId));
    }
}