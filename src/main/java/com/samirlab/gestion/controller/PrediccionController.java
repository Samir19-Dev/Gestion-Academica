package com.samirlab.gestion.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samirlab.gestion.dto.PrediccionDTO;
import com.samirlab.gestion.service.PrediccionService;

@RestController
@RequestMapping("/api/predicciones")
public class PrediccionController {

    private final PrediccionService service;

    public PrediccionController(PrediccionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PrediccionDTO>> obtenerPredicciones() {
        return ResponseEntity.ok(service.calcularRiesgo());
    }

    @GetMapping("/ranking-riesgo")
    public ResponseEntity<List<PrediccionDTO>> rankingRiesgo() {
        return ResponseEntity.ok(service.rankingRiesgo());
    }
}