package com.samirlab.gestion.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "notas")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscripcion_id", nullable = false, unique = true)
    private Inscripcion inscripcion;

    @Column(precision = 4, scale = 2)
    private BigDecimal parcial1;

    @Column(precision = 4, scale = 2)
    private BigDecimal parcial2;

    @Column(name = "final", precision = 4, scale = 2)
    private BigDecimal notaFinal;

    @Column(precision = 4, scale = 2)
    private BigDecimal promedio;

    public Nota() {
    }

    public Nota(Long id, Inscripcion inscripcion, BigDecimal parcial1, BigDecimal parcial2, BigDecimal notaFinal, BigDecimal promedio) {
        this.id = id;
        this.inscripcion = inscripcion;
        this.parcial1 = parcial1;
        this.parcial2 = parcial2;
        this.notaFinal = notaFinal;
        this.promedio = promedio;
    }

    @PrePersist
    @PreUpdate
    public void calcularPromedio() {
        if (parcial1 != null && parcial2 != null && notaFinal != null) {
            this.promedio = parcial1
                    .add(parcial2)
                    .add(notaFinal)
                    .divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Inscripcion getInscripcion() {
        return inscripcion;
    }

    public void setInscripcion(Inscripcion inscripcion) {
        this.inscripcion = inscripcion;
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

    public BigDecimal getNotaFinal() {
        return notaFinal;
    }

    public void setNotaFinal(BigDecimal notaFinal) {
        this.notaFinal = notaFinal;
    }

    public BigDecimal getPromedio() {
        return promedio;
    }

    public void setPromedio(BigDecimal promedio) {
        this.promedio = promedio;
    }
}

