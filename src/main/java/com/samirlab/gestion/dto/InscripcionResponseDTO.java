package com.samirlab.gestion.dto;

public class InscripcionResponseDTO {

    private Long id;
    private Long estudianteId;
    private String estudianteNombre;
    private Long cursoId;
    private String materiaNombre;
    private String grupo;
    private Long docenteId;
    private String docenteNombre;

    public InscripcionResponseDTO() {
    }

    public InscripcionResponseDTO(Long id, Long estudianteId, String estudianteNombre,
                                  Long cursoId, String materiaNombre, String grupo,
                                  Long docenteId, String docenteNombre) {
        this.id = id;
        this.estudianteId = estudianteId;
        this.estudianteNombre = estudianteNombre;
        this.cursoId = cursoId;
        this.materiaNombre = materiaNombre;
        this.grupo = grupo;
        this.docenteId = docenteId;
        this.docenteNombre = docenteNombre;
    }

    public Long getId() {
        return id;
    }

    public Long getEstudianteId() {
        return estudianteId;
    }

    public String getEstudianteNombre() {
        return estudianteNombre;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public String getMateriaNombre() {
        return materiaNombre;
    }

    public String getGrupo() {
        return grupo;
    }

    public Long getDocenteId() {
        return docenteId;
    }

    public String getDocenteNombre() {
        return docenteNombre;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEstudianteId(Long estudianteId) {
        this.estudianteId = estudianteId;
    }

    public void setEstudianteNombre(String estudianteNombre) {
        this.estudianteNombre = estudianteNombre;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }

    public void setMateriaNombre(String materiaNombre) {
        this.materiaNombre = materiaNombre;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public void setDocenteId(Long docenteId) {
        this.docenteId = docenteId;
    }

    public void setDocenteNombre(String docenteNombre) {
        this.docenteNombre = docenteNombre;
    }
}