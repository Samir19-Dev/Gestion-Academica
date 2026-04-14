package com.samirlab.gestion.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samirlab.gestion.dto.CursoDTO;
import com.samirlab.gestion.dto.CursoResponseDTO;
import com.samirlab.gestion.service.CursoService;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    private final CursoService service;

    public CursoController(CursoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CursoResponseDTO>> listar(Principal principal) {
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
    public ResponseEntity<CursoResponseDTO> obtener(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(service.obtenerPorId(id, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<CursoResponseDTO> crear(@RequestBody CursoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.guardar(dto.getMateriaId(), dto.getDocenteId(), dto.getGrupo()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoResponseDTO> actualizar(@PathVariable Long id, @RequestBody CursoDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto.getMateriaId(), dto.getDocenteId(), dto.getGrupo()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok("Curso eliminado correctamente");
    }
}