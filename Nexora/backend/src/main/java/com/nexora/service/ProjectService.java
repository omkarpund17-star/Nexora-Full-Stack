package com.nexora.service;

import com.nexora.model.*;
import com.nexora.repo.ProjectRepository;
import com.nexora.repo.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProjectService {
 private final ProjectRepository projects; private final CurrentUserService current;
 private final TaskRepository tasks;
 public ProjectService(ProjectRepository projects,TaskRepository tasks,CurrentUserService current){this.projects=projects;this.tasks=tasks;this.current=current;}
 public record ProjectRequest(String name,String description,String client,java.time.LocalDate dueDate){}
 public record ProjectView(Long id,String name,String description,String client,String status,java.time.LocalDate dueDate,String owner){}
 public List<ProjectView> all(){return projects.findAllByOrderByCreatedAtDesc().stream().map(this::view).toList();}
 public ProjectView create(ProjectRequest r){
  if(r.name()==null||r.name().isBlank()||r.client()==null||r.client().isBlank()||r.dueDate()==null) throw new IllegalArgumentException("Project name, client and due date are required");
  Project p=new Project();p.setName(r.name().trim());p.setDescription(r.description());p.setClient(r.client().trim());p.setDueDate(r.dueDate());p.setOwner(current.get());
  return view(projects.save(p));
 }
 @Transactional
 public ProjectView update(Long id,ProjectRequest r){
  Project p=projects.findById(id).orElseThrow(()->new IllegalArgumentException("Project not found"));
  if(r.name()==null||r.name().isBlank()||r.client()==null||r.client().isBlank()||r.dueDate()==null) throw new IllegalArgumentException("Project name, client and due date are required");
  p.setName(r.name().trim());p.setDescription(r.description());p.setClient(r.client().trim());p.setDueDate(r.dueDate());
  return view(projects.save(p));
 }
 @Transactional
 public ProjectView status(Long id,String status){
  Project p=projects.findById(id).orElseThrow(()->new IllegalArgumentException("Project not found"));
  String normalized=status==null?"":status.trim().toUpperCase();
  if(!List.of("ACTIVE","REVIEW","ON_HOLD","COMPLETED","ARCHIVED").contains(normalized)) throw new IllegalArgumentException("Invalid project status");
  p.setStatus(normalized);return view(projects.save(p));
 }
 @Transactional
 public void delete(Long id){
  if(!projects.existsById(id)) throw new IllegalArgumentException("Project not found");
  if(tasks.countByProjectId(id)>0) throw new IllegalArgumentException("Move or delete project tasks before deleting this project");
  projects.deleteById(id);
 }
 private ProjectView view(Project p){return new ProjectView(p.getId(),p.getName(),p.getDescription(),p.getClient(),p.getStatus(),p.getDueDate(),p.getOwner().getFullName());}
}
