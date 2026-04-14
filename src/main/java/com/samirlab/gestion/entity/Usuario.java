package com.samirlab.gestion.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String role;

    @Column(name = "must_change_password", nullable = false)
    private Boolean mustChangePassword = true;

    @OneToOne
    @JoinColumn(name = "estudiante_id", unique = true)
    private Estudiante estudiante;

    @OneToOne
    @JoinColumn(name = "docente_id", unique = true)
    private Docente docente;

    public Usuario() {
    }

    public Usuario(Long id, String username, String password, String role,
                   Boolean mustChangePassword, Estudiante estudiante, Docente docente) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.mustChangePassword = mustChangePassword;
        this.estudiante = estudiante;
        this.docente = docente;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public Boolean getMustChangePassword() {
        return mustChangePassword;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public Docente getDocente() {
        return docente;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setMustChangePassword(Boolean mustChangePassword) {
        this.mustChangePassword = mustChangePassword;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public void setDocente(Docente docente) {
        this.docente = docente;
    }
}