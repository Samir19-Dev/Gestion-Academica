package com.samirlab.gestion.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "inscripciones",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"estudiante_id", "curso_id"})
    }
)
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    public Inscripcion() {
    }

    public Inscripcion(Long id, Estudiante estudiante, Curso curso) {
        this.id = id;
        this.estudiante = estudiante;
        this.curso = curso;
    }

    public Long getId() {
        return id;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }
}