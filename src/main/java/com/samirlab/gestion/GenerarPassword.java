package com.samirlab.gestion;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarPassword {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("admin123 -> " + encoder.encode("admin123"));
        System.out.println("docente123 -> " + encoder.encode("docente123"));
        System.out.println("estudiante123 -> " + encoder.encode("estudiante123"));
    }
}
