package com.nexora.controller;

import com.nexora.model.Role;
import com.nexora.service.TaskService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/tasks")
public class TaskController {
 private final TaskService service;
 public TaskController(TaskService s){service=s;}
 @GetMapping public List<TaskService.TaskView> all(){return service.all();}
 @PostMapping @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 public TaskService.TaskView create(@RequestBody TaskService.TaskRequest r){return service.create(r);}
 @PatchMapping("/{id}/status") public TaskService.TaskView status(@PathVariable Long id,@RequestBody Map<String,String> body){return service.status(id,body.getOrDefault("status",""));}
 @PatchMapping("/{id}/assign") @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 public TaskService.TaskView assign(@PathVariable Long id,@RequestBody Map<String,Long> body){return service.assign(id,body.get("assigneeId"));}
 @DeleteMapping("/{id}")
 public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return org.springframework.http.ResponseEntity.noContent().build();}
}
