package com.samirlab.gestion.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "predicciones")
public class Prediccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @Column(length = 50)
    private String riesgo;

    @Column(nullable = false)
    private Double probabilidad;

    public Prediccion() {
    }

    public Prediccion(Long id, Estudiante estudiante, String riesgo, Double probabilidad) {
        this.id = id;
        this.estudiante = estudiante;
        this.riesgo = riesgo;
        this.probabilidad = probabilidad;
    }

    public Long getId() {
        return id;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public String getRiesgo() {
        return riesgo;
    }

    public Double getProbabilidad() {
        return probabilidad;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public void setRiesgo(String riesgo) {
        this.riesgo = riesgo;
    }

    public void setProbabilidad(Double probabilidad) {
        this.probabilidad = probabilidad;
    }
}