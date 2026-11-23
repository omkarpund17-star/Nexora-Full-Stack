package com.nexora.controller;

import com.nexora.model.AppUser;
import com.nexora.service.AuthService;
import com.nexora.service.CurrentUserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthService auth; private final CurrentUserService current;
 public AuthController(AuthService a,CurrentUserService c){auth=a;current=c;}
 public record RegisterRequest(@NotBlank @Size(max=100) String fullName,@Email @NotBlank String email,
  @Size(min=8,max=72) String password,@Size(max=100) String title){}
 public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
 @PostMapping("/register") public AuthService.AuthResponse register(@Valid @RequestBody RegisterRequest r){return auth.register(r.fullName(),r.email(),r.password(),r.title());}
 @PostMapping("/login") public AuthService.AuthResponse login(@Valid @RequestBody LoginRequest r){return auth.login(r.email(),r.password());}
 @GetMapping("/me") public AuthService.UserView me(){return auth.me(current.get());}
}
