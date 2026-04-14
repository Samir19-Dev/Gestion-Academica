package com.samirlab.gestion.service;

import org.springframework.stereotype.Service;

import com.samirlab.gestion.entity.Usuario;
import com.samirlab.gestion.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UsuarioAuthService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioAuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario obtenerUsuarioAutenticado(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    public boolean esAdmin(String username) {
        Usuario usuario = obtenerUsuarioAutenticado(username);
        return "ROLE_ADMIN".equals(usuario.getRole());
    }

    public boolean esDocente(String username) {
        Usuario usuario = obtenerUsuarioAutenticado(username);
        return "ROLE_DOCENTE".equals(usuario.getRole());
    }
}