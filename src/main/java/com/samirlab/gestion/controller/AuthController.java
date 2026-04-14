package com.samirlab.gestion.controller;

import java.security.Principal;

import com.samirlab.gestion.dto.AuthRequest;
import com.samirlab.gestion.dto.AuthResponse;
import com.samirlab.gestion.dto.ChangePasswordRequest;
import com.samirlab.gestion.entity.Usuario;
import com.samirlab.gestion.repository.UsuarioRepository;
import com.samirlab.gestion.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {

        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Correo y contraseña obligatorios");
        }

        String username = request.getUsername().trim().toLowerCase();

        if (usuarioRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("El correo ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRole("ROLE_ESTUDIANTE");
        usuario.setMustChangePassword(true);

        usuarioRepository.save(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            if (request.getUsername() == null || request.getUsername().isBlank()
                    || request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body("Correo y contraseña obligatorios");
            }

            String username = request.getUsername().trim().toLowerCase();

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username,
                            request.getPassword()
                    )
            );

            Usuario usuario = usuarioRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String token = jwtService.generateToken(usuario.getUsername(), usuario.getRole());

            return ResponseEntity.ok(
                    new AuthResponse(
                            token,
                            usuario.getUsername(),
                            usuario.getRole(),
                            usuario.getMustChangePassword()
                    )
            );

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()
                || request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Debes enviar la contraseña actual y la nueva");
        }

        if (request.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest().body("La nueva contraseña debe tener al menos 6 caracteres");
        }

        Usuario usuario = usuarioRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), usuario.getPassword())) {
            return ResponseEntity.badRequest().body("La contraseña actual no es correcta");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuario.setMustChangePassword(false);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
}