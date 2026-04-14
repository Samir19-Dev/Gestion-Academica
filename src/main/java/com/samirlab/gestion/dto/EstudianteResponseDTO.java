package com.samirlab.gestion.dto;

public class EstudianteResponseDTO {

    private Long id;
    private String nombre;
    private Integer semestre;
    private Long carreraId;
    private String carreraNombre;

    public EstudianteResponseDTO() {
    }

    public EstudianteResponseDTO(Long id, String nombre, Integer semestre, Long carreraId, String carreraNombre) {
        this.id = id;
        this.nombre = nombre;
        this.semestre = semestre;
        this.carreraId = carreraId;
        this.carreraNombre = carreraNombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getSemestre() {
        return semestre;
    }

    public void setSemestre(Integer semestre) {
        this.semestre = semestre;
    }

    public Long getCarreraId() {
        return carreraId;
    }

    public void setCarreraId(Long carreraId) {
        this.carreraId = carreraId;
    }

    public String getCarreraNombre() {
        return carreraNombre;
    }

    public void setCarreraNombre(String carreraNombre) {
        this.carreraNombre = carreraNombre;
    }
}

