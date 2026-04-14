package com.samirlab.gestion.dto;

public class PromedioMateriaDTO {

    private String materia;
    private Double promedio;

    public PromedioMateriaDTO(String materia, Double promedio) {
        this.materia = materia;
        this.promedio = promedio;
    }

    public String getMateria() {
        return materia;
    }

    public Double getPromedio() {
        return promedio;
    }
}