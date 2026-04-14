package com.samirlab.gestion.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samirlab.gestion.dto.AsistenciaResponseDTO;
import com.samirlab.gestion.entity.Asistencia;
import com.samirlab.gestion.service.AsistenciaService;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    private final AsistenciaService service;

    public AsistenciaController(AsistenciaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AsistenciaResponseDTO>> listar(Principal principal) {
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
    public ResponseEntity<AsistenciaResponseDTO> obtenerPorId(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(service.obtenerPorId(id, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<AsistenciaResponseDTO> crear(@RequestBody Asistencia asistencia, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.crear(asistencia, principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaResponseDTO> actualizar(@PathVariable Long id,
                                                            @RequestBody Asistencia asistencia,
                                                            Principal principal) {
        return ResponseEntity.ok(service.actualizar(id, asistencia, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id, Principal principal) {
        service.eliminar(id, principal.getName());
        return ResponseEntity.ok("Asistencia eliminada correctamente");
    }
}