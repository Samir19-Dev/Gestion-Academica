package com.samirlab.gestion.service;

import org.springframework.stereotype.Service;

import com.samirlab.gestion.entity.Docente;
import com.samirlab.gestion.entity.Usuario;
import com.samirlab.gestion.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DocenteAuthService {

    private final UsuarioRepository usuarioRepository;

    public DocenteAuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Docente obtenerDocenteAutenticado(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        if (usuario.getDocente() == null) {
            throw new EntityNotFoundException("El usuario no tiene un docente asociado");
        }

        return usuario.getDocente();
    }
}
