package com.samirlab.gestion.dto;

public class PrediccionDTO {

    private Long estudianteId;
    private String estudianteNombre;
    private double promedio;
    private double porcentajeAsistencia;
    private String riesgo;
    private double probabilidad;

    public PrediccionDTO() {
    }

    public PrediccionDTO(Long estudianteId, String estudianteNombre, double promedio,
                         double porcentajeAsistencia, String riesgo, double probabilidad) {
        this.estudianteId = estudianteId;
        this.estudianteNombre = estudianteNombre;
        this.promedio = promedio;
        this.porcentajeAsistencia = porcentajeAsistencia;
        this.riesgo = riesgo;
        this.probabilidad = probabilidad;
    }

    public Long getEstudianteId() {
        return estudianteId;
    }

    public void setEstudianteId(Long estudianteId) {
        this.estudianteId = estudianteId;
    }

    public String getEstudianteNombre() {
        return estudianteNombre;
    }

    public void setEstudianteNombre(String estudianteNombre) {
        this.estudianteNombre = estudianteNombre;
    }

    public double getPromedio() {
        return promedio;
    }

    public void setPromedio(double promedio) {
        this.promedio = promedio;
    }

    public double getPorcentajeAsistencia() {
        return porcentajeAsistencia;
    }

    public void setPorcentajeAsistencia(double porcentajeAsistencia) {
        this.porcentajeAsistencia = porcentajeAsistencia;
    }

    public String getRiesgo() {
        return riesgo;
    }

    public void setRiesgo(String riesgo) {
        this.riesgo = riesgo;
    }

    public double getProbabilidad() {
        return probabilidad;
    }

    public void setProbabilidad(double probabilidad) {
        this.probabilidad = probabilidad;
    }
}
