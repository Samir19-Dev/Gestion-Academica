package com.samirlab.gestion.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, UserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Auth públicos
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()

                // Auth autenticado
                .requestMatchers(HttpMethod.POST, "/api/auth/change-password").authenticated()

                // Dashboard
                .requestMatchers(HttpMethod.GET, "/api/dashboard/**")
                    .hasAnyRole("ADMIN", "DOCENTE")

                // Predicciones
                .requestMatchers(HttpMethod.GET, "/api/predicciones/**")
                    .hasAnyRole("ADMIN", "DOCENTE")

                // Boletín
                .requestMatchers(HttpMethod.GET, "/api/boletin/mio")
                    .hasRole("ESTUDIANTE")
                .requestMatchers(HttpMethod.GET, "/api/boletin/estudiante/**")
                    .hasAnyRole("ADMIN", "DOCENTE")

                // Consultas
                .requestMatchers(HttpMethod.GET, "/api/estudiantes/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/docentes/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/materias/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/cursos/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/notas/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/asistencias/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/inscripciones/**")
                    .hasAnyRole("ADMIN", "DOCENTE")

                // Inscripciones: solo ADMIN
                .requestMatchers(HttpMethod.POST, "/api/inscripciones/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/inscripciones/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/inscripciones/**")
                    .hasRole("ADMIN")

                // Estudiantes: solo ADMIN
                .requestMatchers(HttpMethod.POST, "/api/estudiantes/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/estudiantes/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/estudiantes/**")
                    .hasRole("ADMIN")

                // Docentes: solo ADMIN
                .requestMatchers(HttpMethod.POST, "/api/docentes/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/docentes/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/docentes/**")
                    .hasRole("ADMIN")

                // Materias: solo ADMIN
                .requestMatchers(HttpMethod.POST, "/api/materias/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/materias/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/materias/**")
                    .hasRole("ADMIN")

                // Cursos: solo ADMIN
                .requestMatchers(HttpMethod.POST, "/api/cursos/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/cursos/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/cursos/**")
                    .hasRole("ADMIN")

                // Notas: ADMIN y DOCENTE
                .requestMatchers(HttpMethod.POST, "/api/notas/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.PUT, "/api/notas/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.DELETE, "/api/notas/**")
                    .hasAnyRole("ADMIN", "DOCENTE")

                // Asistencias: ADMIN y DOCENTE
                .requestMatchers(HttpMethod.POST, "/api/asistencias/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.PUT, "/api/asistencias/**")
                    .hasAnyRole("ADMIN", "DOCENTE")
                .requestMatchers(HttpMethod.DELETE, "/api/asistencias/**")
                    .hasAnyRole("ADMIN", "DOCENTE")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}