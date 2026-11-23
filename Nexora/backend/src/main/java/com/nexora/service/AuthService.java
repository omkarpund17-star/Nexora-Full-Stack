package com.nexora.service;

import com.nexora.model.*;
import com.nexora.repo.UserRepository;
import com.nexora.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(UserRepository users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
 public record AuthResponse(String token, Long id, String fullName, String email, String role, String title) {}
 public record UserView(Long id,String fullName,String email,String role,String title) {}
 @Transactional
 public AuthResponse register(String name,String email,String password,String title){
  String normalized=email.trim().toLowerCase();
  if(users.existsByEmail(normalized)) throw new IllegalArgumentException("An account with this email already exists");
  AppUser u=new AppUser(); u.setFullName(name.trim()); u.setEmail(normalized); u.setPassword(encoder.encode(password));
  u.setTitle(title==null||title.isBlank()?"Team member":title.trim());
  u.setRole(users.count()==0?Role.ADMIN:Role.MEMBER);
  users.save(u); return response(u);
 }
 public AuthResponse login(String email,String password){
  AppUser u=users.findByEmail(email.trim().toLowerCase()).orElseThrow(()->new IllegalArgumentException("Invalid email or password"));
  if(!encoder.matches(password,u.getPassword())) throw new IllegalArgumentException("Invalid email or password");
  return response(u);
 }
 public UserView me(AppUser u){return view(u);}
 public AuthResponse response(AppUser u){return new AuthResponse(jwt.generate(u),u.getId(),u.getFullName(),u.getEmail(),u.getRole().name(),u.getTitle());}
 public UserView view(AppUser u){return new UserView(u.getId(),u.getFullName(),u.getEmail(),u.getRole().name(),u.getTitle());}
}
