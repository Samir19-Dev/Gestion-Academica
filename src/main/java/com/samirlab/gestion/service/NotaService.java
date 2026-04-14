package com.samirlab.gestion.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.samirlab.gestion.dto.NotaDTO;
import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.entity.Inscripcion;
import com.samirlab.gestion.entity.Nota;
import com.samirlab.gestion.repository.InscripcionRepository;
import com.samirlab.gestion.repository.NotaRepository;

@Service
public class NotaService {

    private final NotaRepository notaRepository;
    private final InscripcionRepository inscripcionRepository;
    private final DocenteAuthService docenteAuthService;
    private final UsuarioAuthService usuarioAuthService;

    public NotaService(NotaRepository notaRepository,
                       InscripcionRepository inscripcionRepository,
                       DocenteAuthService docenteAuthService,
                       UsuarioAuthService usuarioAuthService) {
        this.notaRepository = notaRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.docenteAuthService = docenteAuthService;
        this.usuarioAuthService = usuarioAuthService;
    }

    public List<NotaDTO> listarTodas() {
        return notaRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<NotaDTO> listarPorDocenteAutenticado(String username) {
        Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

        return notaRepository.findByInscripcionCursoDocenteId(docente.getId())
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public NotaDTO obtenerPorId(Long id, String username) {
        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada con id: " + id));

        validarAccesoANota(nota, username);

        return convertirADTO(nota);
    }

    public NotaDTO guardar(NotaDTO dto, String username) {
        validar(dto);

        if (notaRepository.findByInscripcionId(dto.getInscripcionId()).isPresent()) {
            throw new RuntimeException("Ya existe una nota para esta inscripción");
        }

        Inscripcion inscripcion = inscripcionRepository.findById(dto.getInscripcionId())
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        validarAccesoAInscripcion(inscripcion, username);

        Nota nota = new Nota();
        nota.setInscripcion(inscripcion);
        nota.setParcial1(dto.getParcial1());
        nota.setParcial2(dto.getParcial2());
        nota.setNotaFinal(dto.getFinalNota());
        nota.setPromedio(calcularPromedio(dto.getParcial1(), dto.getParcial2(), dto.getFinalNota()));

        return convertirADTO(notaRepository.save(nota));
    }

    public NotaDTO actualizar(Long id, NotaDTO dto, String username) {
        validar(dto);

        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada con id: " + id));

        validarAccesoANota(nota, username);

        Inscripcion inscripcion = inscripcionRepository.findById(dto.getInscripcionId())
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        validarAccesoAInscripcion(inscripcion, username);

        notaRepository.findByInscripcionId(dto.getInscripcionId()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new RuntimeException("Ya existe una nota para esta inscripción");
            }
        });

        nota.setInscripcion(inscripcion);
        nota.setParcial1(dto.getParcial1());
        nota.setParcial2(dto.getParcial2());
        nota.setNotaFinal(dto.getFinalNota());
        nota.setPromedio(calcularPromedio(dto.getParcial1(), dto.getParcial2(), dto.getFinalNota()));

        return convertirADTO(notaRepository.save(nota));
    }

    public void eliminar(Long id, String username) {
        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada con id: " + id));

        validarAccesoANota(nota, username);

        notaRepository.delete(nota);
    }

    private void validarAccesoANota(Nota nota, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            Long docenteNota = nota.getInscripcion()
                    .getCurso()
                    .getDocente()
                    .getId();

            if (!docente.getId().equals(docenteNota)) {
                throw new RuntimeException("No tienes permiso para acceder a esta nota");
            }
        }
    }

    private void validarAccesoAInscripcion(Inscripcion inscripcion, String username) {
        if (usuarioAuthService.esAdmin(username)) {
            return;
        }

        if (usuarioAuthService.esDocente(username)) {
            Docente docente = docenteAuthService.obtenerDocenteAutenticado(username);

            Long docenteCurso = inscripcion.getCurso()
                    .getDocente()
                    .getId();

            if (!docente.getId().equals(docenteCurso)) {
                throw new RuntimeException("No tienes permiso para gestionar notas de esta inscripción");
            }
        }
    }

    private void validar(NotaDTO dto) {
        if (dto.getInscripcionId() == null) {
            throw new RuntimeException("La inscripción es obligatoria");
        }

        validarRango(dto.getParcial1(), "Parcial 1");
        validarRango(dto.getParcial2(), "Parcial 2");
        validarRango(dto.getFinalNota(), "Final");
    }

    private void validarRango(BigDecimal nota, String campo) {
        if (nota == null) {
            throw new RuntimeException(campo + " es obligatoria");
        }

        if (nota.compareTo(BigDecimal.ZERO) < 0 || nota.compareTo(new BigDecimal("5.0")) > 0) {
            throw new RuntimeException(campo + " debe estar entre 0.0 y 5.0");
        }
    }

    private BigDecimal calcularPromedio(BigDecimal p1, BigDecimal p2, BigDecimal fin) {
        return p1.add(p2)
                .add(fin)
                .divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP);
    }

    private NotaDTO convertirADTO(Nota nota) {
        NotaDTO dto = new NotaDTO();
        dto.setId(nota.getId());
        dto.setParcial1(nota.getParcial1());
        dto.setParcial2(nota.getParcial2());
        dto.setFinalNota(nota.getNotaFinal());
        dto.setPromedio(nota.getPromedio());

        if (nota.getInscripcion() != null) {
            dto.setInscripcionId(nota.getInscripcion().getId());

            String estudiante = nota.getInscripcion().getEstudiante() != null
                    ? nota.getInscripcion().getEstudiante().getNombre()
                    : "Sin estudiante";

            String materia = "Sin materia";
            String grupo = "Sin grupo";

            if (nota.getInscripcion().getCurso() != null) {
                if (nota.getInscripcion().getCurso().getMateria() != null) {
                    materia = nota.getInscripcion().getCurso().getMateria().getNombre();
                }
                if (nota.getInscripcion().getCurso().getGrupo() != null) {
                    grupo = nota.getInscripcion().getCurso().getGrupo();
                }
            }

            dto.setInscripcionDescripcion(estudiante + " - " + materia + " - Grupo " + grupo);
        }

        return dto;
    }
}