package com.nexora.controller;

import com.nexora.model.Role;
import com.nexora.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/projects")
public class ProjectController {
 private final ProjectService service;
 public ProjectController(ProjectService s){service=s;}
 @GetMapping public List<ProjectService.ProjectView> all(){return service.all();}
 @PostMapping @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 public ProjectService.ProjectView create(@RequestBody ProjectService.ProjectRequest r){return service.create(r);}
 @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 public ProjectService.ProjectView update(@PathVariable Long id,@RequestBody ProjectService.ProjectRequest r){return service.update(id,r);}
 @PatchMapping("/{id}/status") @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 public ProjectService.ProjectView status(@PathVariable Long id,@RequestBody java.util.Map<String,String> body){return service.status(id,body.get("status"));}
 @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return org.springframework.http.ResponseEntity.noContent().build();}
}
