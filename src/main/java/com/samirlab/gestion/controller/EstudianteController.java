package com.samirlab.gestion.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samirlab.gestion.dto.EstudianteRequestDTO;
import com.samirlab.gestion.dto.EstudianteResponseDTO;
import com.samirlab.gestion.service.EstudianteService;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    private final EstudianteService service;

    public EstudianteController(EstudianteService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EstudianteResponseDTO>> listarTodos(Principal principal) {
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

        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteResponseDTO> obtenerPorId(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(service.obtenerPorId(id, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<EstudianteResponseDTO> crear(@RequestBody EstudianteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudianteResponseDTO> actualizar(@PathVariable Long id,
                                                            @RequestBody EstudianteRequestDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok("Estudiante eliminado correctamente");
    }
}