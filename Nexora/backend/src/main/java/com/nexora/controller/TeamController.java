package com.nexora.controller;

import com.nexora.repo.UserRepository;
import com.nexora.service.AuthService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import com.nexora.model.AppUser;
import com.nexora.model.Role;
import com.nexora.service.CurrentUserService;
import java.util.Map;

@RestController @RequestMapping("/api/team")
public class TeamController {
 private final UserRepository users; private final AuthService auth;
 private final CurrentUserService current;
 public TeamController(UserRepository u,AuthService a,CurrentUserService c){users=u;auth=a;current=c;}
 @GetMapping public List<AuthService.UserView> all(){return users.findAll().stream().map(auth::view).toList();}
 @PatchMapping("/{id}/role") @PreAuthorize("hasRole('ADMIN')")
 public AuthService.UserView role(@PathVariable Long id,@RequestBody Map<String,String> body){
  AppUser u=users.findById(id).orElseThrow(()->new IllegalArgumentException("Team member not found"));
  try { u.setRole(Role.valueOf(body.getOrDefault("role","").toUpperCase())); } catch(Exception e){throw new IllegalArgumentException("Role must be ADMIN, MANAGER or MEMBER");}
  return auth.view(users.save(u));
 }
 @PatchMapping("/{id}/profile") @Transactional
 public AuthService.UserView profile(@PathVariable Long id,@RequestBody Map<String,String> body){
  if(!current.get().getId().equals(id)&&current.get().getRole()!=Role.ADMIN) throw new org.springframework.security.access.AccessDeniedException("You can only update your own profile");
  AppUser u=users.findById(id).orElseThrow(()->new IllegalArgumentException("Team member not found"));
  String fullName=body.get("fullName"); String title=body.get("title");
  if(fullName==null||fullName.trim().isEmpty()) throw new IllegalArgumentException("Full name is required");
  u.setFullName(fullName.trim()); u.setTitle(title==null?"":title.trim());
  return auth.view(users.save(u));
 }
}
