package com.samirlab.gestion.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samirlab.gestion.service.BoletinService;

@RestController
@RequestMapping("/api/boletin")
public class BoletinController {

    private final BoletinService service;

    public BoletinController(BoletinService service) {
        this.service = service;
    }

    @GetMapping("/estudiante/{id}")
    public ResponseEntity<?> obtenerBoletin(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.obtenerBoletinPorEstudiante(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/mio")
    public ResponseEntity<?> obtenerMiBoletin(Principal principal) {
        try {
            return ResponseEntity.ok(service.obtenerMiBoletin(principal.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}