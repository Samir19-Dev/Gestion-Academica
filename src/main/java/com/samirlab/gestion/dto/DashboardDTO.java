package com.samirlab.gestion.dto;

import java.math.BigDecimal;

public class DashboardDTO {

    private Long estudiantes;
    private Long docentes;
    private Long materias;
    private Long cursos;
    private Long inscripciones;
    private Long notas;
    private Long asistencias;

    private BigDecimal promedioAsistencia;
    private Long estudiantesAprobados;

    public DashboardDTO() {}

    public Long getEstudiantes() { return estudiantes; }
    public void setEstudiantes(Long estudiantes) { this.estudiantes = estudiantes; }

    public Long getDocentes() { return docentes; }
    public void setDocentes(Long docentes) { this.docentes = docentes; }

    public Long getMaterias() { return materias; }
    public void setMaterias(Long materias) { this.materias = materias; }

    public Long getCursos() { return cursos; }
    public void setCursos(Long cursos) { this.cursos = cursos; }

    public Long getInscripciones() { return inscripciones; }
    public void setInscripciones(Long inscripciones) { this.inscripciones = inscripciones; }

    public Long getNotas() { return notas; }
    public void setNotas(Long notas) { this.notas = notas; }

    public Long getAsistencias() { return asistencias; }
    public void setAsistencias(Long asistencias) { this.asistencias = asistencias; }

    public BigDecimal getPromedioAsistencia() { return promedioAsistencia; }
    public void setPromedioAsistencia(BigDecimal promedioAsistencia) { this.promedioAsistencia = promedioAsistencia; }

    public Long getEstudiantesAprobados() { return estudiantesAprobados; }
    public void setEstudiantesAprobados(Long estudiantesAprobados) { this.estudiantesAprobados = estudiantesAprobados; }
}
