package com.samirlab.gestion.dto;

public class AuthResponse {

    private String token;
    private String username;
    private String role;
    private Boolean mustChangePassword;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String role, Boolean mustChangePassword) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.mustChangePassword = mustChangePassword;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public Boolean getMustChangePassword() {
        return mustChangePassword;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setMustChangePassword(Boolean mustChangePassword) {
        this.mustChangePassword = mustChangePassword;
    }
}