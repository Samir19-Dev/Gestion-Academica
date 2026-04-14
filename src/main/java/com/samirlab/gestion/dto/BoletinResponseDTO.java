package com.samirlab.gestion.dto;

import java.math.BigDecimal;
import java.util.List;

public class BoletinResponseDTO {

    private String estudiante;
    private List<BoletinItemDTO> materias;
    private BigDecimal promedioGeneral;
    private String estadoGeneral;

    public BoletinResponseDTO() {
    }

    public String getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(String estudiante) {
        this.estudiante = estudiante;
    }

    public List<BoletinItemDTO> getMaterias() {
        return materias;
    }

    public void setMaterias(List<BoletinItemDTO> materias) {
        this.materias = materias;
    }

    public BigDecimal getPromedioGeneral() {
        return promedioGeneral;
    }

    public void setPromedioGeneral(BigDecimal promedioGeneral) {
        this.promedioGeneral = promedioGeneral;
    }

    public String getEstadoGeneral() {
        return estadoGeneral;
    }

    public void setEstadoGeneral(String estadoGeneral) {
        this.estadoGeneral = estadoGeneral;
    }
}
