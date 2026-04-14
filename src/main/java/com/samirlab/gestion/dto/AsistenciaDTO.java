package com.samirlab.gestion.dto;

import java.time.LocalDate;

public class AsistenciaDTO {

    private Long id;
    private Long inscripcionId;
    private String inscripcionDescripcion;
    private LocalDate fecha;
    private Boolean presente;

    public AsistenciaDTO() {
    }

    public Long getId() {
        return id;
    }

    public Long getInscripcionId() {
        return inscripcionId;
    }

    public String getInscripcionDescripcion() {
        return inscripcionDescripcion;
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

    public void setInscripcionId(Long inscripcionId) {
        this.inscripcionId = inscripcionId;
    }

    public void setInscripcionDescripcion(String inscripcionDescripcion) {
        this.inscripcionDescripcion = inscripcionDescripcion;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setPresente(Boolean presente) {
        this.presente = presente;
    }
}