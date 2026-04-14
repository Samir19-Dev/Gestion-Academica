package com.samirlab.gestion.dto;

public class CursoDTO {

    private Long id;
    private Long materiaId;
    private String materiaNombre;
    private Long docenteId;
    private String docenteNombre;
    private String grupo;

    public CursoDTO() {
    }

    public Long getId() {
        return id;
    }

    public Long getMateriaId() {
        return materiaId;
    }

    public String getMateriaNombre() {
        return materiaNombre;
    }

    public Long getDocenteId() {
        return docenteId;
    }

    public String getDocenteNombre() {
        return docenteNombre;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMateriaId(Long materiaId) {
        this.materiaId = materiaId;
    }

    public void setMateriaNombre(String materiaNombre) {
        this.materiaNombre = materiaNombre;
    }

    public void setDocenteId(Long docenteId) {
        this.docenteId = docenteId;
    }

    public void setDocenteNombre(String docenteNombre) {
        this.docenteNombre = docenteNombre;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }
}
