package com.samirlab.gestion.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.samirlab.gestion.dto.BoletinItemDTO;
import com.samirlab.gestion.dto.BoletinResponseDTO;
import com.samirlab.gestion.entity.Inscripcion;
import com.samirlab.gestion.entity.Usuario;
import com.samirlab.gestion.repository.EstudianteRepository;
import com.samirlab.gestion.repository.InscripcionRepository;
import com.samirlab.gestion.repository.NotaRepository;
import com.samirlab.gestion.repository.UsuarioRepository;

@Service
@Transactional(readOnly = true)
public class BoletinService {

    private final EstudianteRepository estudianteRepository;
    private final InscripcionRepository inscripcionRepository;
    private final NotaRepository notaRepository;
    private final UsuarioRepository usuarioRepository;

    public BoletinService(EstudianteRepository estudianteRepository,
                          InscripcionRepository inscripcionRepository,
                          NotaRepository notaRepository,
                          UsuarioRepository usuarioRepository) {
        this.estudianteRepository = estudianteRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.notaRepository = notaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public BoletinResponseDTO obtenerBoletinPorEstudiante(Long estudianteId) {
        if (!estudianteRepository.existsById(estudianteId)) {
            throw new EntityNotFoundException("Estudiante no encontrado con id: " + estudianteId);
        }

        List<Inscripcion> inscripciones = inscripcionRepository.findByEstudianteId(estudianteId);

        if (inscripciones.isEmpty()) {
            throw new EntityNotFoundException("Estudiante sin inscripciones: " + estudianteId);
        }

        List<BoletinItemDTO> boletin = inscripciones.stream()
                .map(this::mapearInscripcionANotaDTO)
                .toList();

        BoletinResponseDTO response = new BoletinResponseDTO();
        response.setEstudiante(inscripciones.get(0).getEstudiante().getNombre());
        response.setMaterias(boletin);
        response.setPromedioGeneral(calcularPromedioGeneral(boletin));
        response.setEstadoGeneral(estadoGeneral(response.getPromedioGeneral()));

        return response;
    }

    public BoletinResponseDTO obtenerMiBoletin(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        if (usuario.getEstudiante() == null || usuario.getEstudiante().getId() == null) {
            throw new EntityNotFoundException("El usuario no tiene un estudiante asociado");
        }

        return obtenerBoletinPorEstudiante(usuario.getEstudiante().getId());
    }

    private BoletinItemDTO mapearInscripcionANotaDTO(Inscripcion inscripcion) {
        BoletinItemDTO dto = new BoletinItemDTO();
        dto.setEstudiante(inscripcion.getEstudiante().getNombre());
        dto.setMateria(inscripcion.getCurso().getMateria().getNombre());
        dto.setGrupo(inscripcion.getCurso().getGrupo());

        notaRepository.findByInscripcionId(inscripcion.getId())
                .ifPresentOrElse(
                        nota -> {
                            dto.setParcial1(nota.getParcial1());
                            dto.setParcial2(nota.getParcial2());
                            dto.setFinalNota(nota.getNotaFinal());
                            dto.setPromedio(nota.getPromedio());
                            dto.setEstado(
                                    nota.getPromedio() != null && nota.getPromedio().compareTo(BigDecimal.valueOf(3.0)) >= 0
                                            ? "Aprobado"
                                            : "Reprobado"
                            );
                        },
                        () -> dto.setEstado("Sin nota")
                );

        return dto;
    }

    private BigDecimal calcularPromedioGeneral(List<BoletinItemDTO> boletin) {
        List<BigDecimal> promedios = boletin.stream()
                .map(BoletinItemDTO::getPromedio)
                .filter(p -> p != null)
                .toList();

        if (promedios.isEmpty()) {
            return null;
        }

        return promedios.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(promedios.size()), 2, RoundingMode.HALF_UP);
    }

    private String estadoGeneral(BigDecimal promedioGeneral) {
        if (promedioGeneral == null) {
            return "Sin notas";
        }
        return promedioGeneral.compareTo(BigDecimal.valueOf(3.0)) >= 0 ? "Aprobado" : "Reprobado";
    }
}
