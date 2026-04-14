package com.samirlab.gestion.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samirlab.gestion.dto.MateriaResponseDTO;
import com.samirlab.gestion.entity.Materia;
import com.samirlab.gestion.service.MateriaService;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    private final MateriaService service;

    public MateriaController(MateriaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<MateriaResponseDTO>> listar(Principal principal) {
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
    public ResponseEntity<MateriaResponseDTO> obtener(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(service.obtenerPorId(id, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<MateriaResponseDTO> crear(@RequestBody Materia materia) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(materia));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MateriaResponseDTO> actualizar(@PathVariable Long id, @RequestBody Materia materia) {
        return ResponseEntity.ok(service.actualizar(id, materia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok("Materia eliminada correctamente");
    }
}