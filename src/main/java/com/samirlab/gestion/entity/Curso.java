
package com.samirlab.gestion.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cursos")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Docente docente;

    @Column(length = 20)
    private String grupo;

    public Curso() {
    }

    public Curso(Long id, Materia materia, Docente docente, String grupo) {
        this.id = id;
        this.materia = materia;
        this.docente = docente;
        this.grupo = grupo;
    }

    public Long getId() {
        return id;
    }

    public Materia getMateria() {
        return materia;
    }

    public Docente getDocente() {
        return docente;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMateria(Materia materia) {
        this.materia = materia;
    }

    public void setDocente(Docente docente) {
        this.docente = docente;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }
}