package com.samirlab.gestion.dto;

import java.math.BigDecimal;

public class BoletinItemDTO {

    private String estudiante;
    private String materia;
    private String grupo;
    private BigDecimal parcial1;
    private BigDecimal parcial2;
    private BigDecimal finalNota;
    private BigDecimal promedio;
    private String estado;

    public BoletinItemDTO() {
    }

    public String getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(String estudiante) {
        this.estudiante = estudiante;
    }

    public String getMateria() {
        return materia;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
