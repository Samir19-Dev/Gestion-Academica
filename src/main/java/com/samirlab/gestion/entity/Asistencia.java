package com.samirlab.gestion.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "asistencias",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"inscripcion_id", "fecha"})
    }
)
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscripcion_id", nullable = false)
    private Inscripcion inscripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private Boolean presente;

    public Asistencia() {
    }

    public Asistencia(Long id, Inscripcion inscripcion, LocalDate fecha, Boolean presente) {
        this.id = id;
        this.inscripcion = inscripcion;
        this.fecha = fecha;
        this.presente = presente;
    }

    public Long getId() {
        return id;
    }

    public Inscripcion getInscripcion() {
        return inscripcion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public Boolean getPresente() {
        return presente;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setInscripcion(Inscripcion inscripcion) {
        this.inscripcion = inscripcion;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setPresente(Boolean presente) {
        this.presente = presente;
    }
}
