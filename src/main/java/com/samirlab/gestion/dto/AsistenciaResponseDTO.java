package com.samirlab.gestion.dto;

import java.time.LocalDate;

public class AsistenciaResponseDTO {

    private Long id;
    private LocalDate fecha;
    private Boolean presente;
    private Long inscripcionId;
    private String inscripcionDescripcion;

    public AsistenciaResponseDTO() {
    }

    public AsistenciaResponseDTO(Long id, LocalDate fecha, Boolean presente,
                                 Long inscripcionId, String inscripcionDescripcion) {
        this.id = id;
        this.fecha = fecha;
        this.presente = presente;
        this.inscripcionId = inscripcionId;
        this.inscripcionDescripcion = inscripcionDescripcion;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public Boolean getPresente() {
        return presente;
    }

    public Long getInscripcionId() {
        return inscripcionId;
    }

    public String getInscripcionDescripcion() {
        return inscripcionDescripcion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setPresente(Boolean presente) {
        this.presente = presente;
    }

    public void setInscripcionId(Long inscripcionId) {
        this.inscripcionId = inscripcionId;
    }

    public void setInscripcionDescripcion(String inscripcionDescripcion) {
        this.inscripcionDescripcion = inscripcionDescripcion;
    }
}