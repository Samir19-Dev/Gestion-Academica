package com.samirlab.gestion.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samirlab.gestion.dto.NotaDTO;
import com.samirlab.gestion.service.NotaService;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    private final NotaService service;

    public NotaController(NotaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NotaDTO>> listarTodas(Principal principal) {
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

        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaDTO> obtenerPorId(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(service.obtenerPorId(id, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<NotaDTO> crear(@RequestBody NotaDTO dto, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.guardar(dto, principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotaDTO> actualizar(@PathVariable Long id,
                                              @RequestBody NotaDTO dto,
                                              Principal principal) {
        return ResponseEntity.ok(service.actualizar(id, dto, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id, Principal principal) {
        service.eliminar(id, principal.getName());
        return ResponseEntity.ok("Nota eliminada correctamente");
    }
}