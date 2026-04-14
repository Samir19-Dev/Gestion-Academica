package com.samirlab.gestion.dto;

public class MateriaResponseDTO {

    private Long id;
    private String nombre;
    private Integer creditos;

    public MateriaResponseDTO() {
    }

    public MateriaResponseDTO(Long id, String nombre, Integer creditos) {
        this.id = id;
        this.nombre = nombre;
        this.creditos = creditos;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Integer getCreditos() {
        return creditos;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCreditos(Integer creditos) {
        this.creditos = creditos;
    }
}