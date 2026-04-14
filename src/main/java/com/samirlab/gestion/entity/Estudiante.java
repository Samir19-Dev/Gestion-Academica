package com.samirlab.gestion.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "estudiantes")
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrera_id", nullable = false)
    private Carrera carrera;

    @Column(nullable = false)
    private Integer semestre;

    public Estudiante() {
    }

    public Estudiante(Long id, String nombre, Carrera carrera, Integer semestre) {
        this.id = id;
        this.nombre = nombre;
        this.carrera = carrera;
        this.semestre = semestre;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Carrera getCarrera() {
        return carrera;
    }

    public Integer getSemestre() {
        return semestre;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCarrera(Carrera carrera) {
        this.carrera = carrera;
    }

    public void setSemestre(Integer semestre) {
        this.semestre = semestre;
    }
}
