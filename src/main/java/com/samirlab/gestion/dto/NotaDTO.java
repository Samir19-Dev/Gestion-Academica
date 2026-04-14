package com.samirlab.gestion.dto;

import java.math.BigDecimal;

public class NotaDTO {

    private Long id;
    private Long inscripcionId;
    private String inscripcionDescripcion;
    private BigDecimal parcial1;
    private BigDecimal parcial2;
    private BigDecimal finalNota;
    private BigDecimal promedio;

    public NotaDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInscripcionId() {
        return inscripcionId;
    }

    public void setInscripcionId(Long inscripcionId) {
        this.inscripcionId = inscripcionId;
    }

    public String getInscripcionDescripcion() {
        return inscripcionDescripcion;
    }

    public void setInscripcionDescripcion(String inscripcionDescripcion) {
        this.inscripcionDescripcion = inscripcionDescripcion;
    }

    public BigDecimal getParcial1() {
        return parcial1;
    }

    public void setParcial1(BigDecimal parcial1) {
        this.parcial1 = parcial1;
    }

    public BigDecimal getParcial2() {
        return parcial2;
    }

    public void setParcial2(BigDecimal parcial2) {
        this.parcial2 = parcial2;
    }

    public BigDecimal getFinalNota() {
        return finalNota;
    }

    public void setFinalNota(BigDecimal finalNota) {
        this.finalNota = finalNota;
    }

    public BigDecimal getPromedio() {
        return promedio;
    }

    public void setPromedio(BigDecimal promedio) {
        this.promedio = promedio;
    }
}
