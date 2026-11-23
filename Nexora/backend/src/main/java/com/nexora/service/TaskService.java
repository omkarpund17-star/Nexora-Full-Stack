package com.nexora.service;

import com.nexora.model.*;
import com.nexora.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {
 private final TaskRepository tasks; private final ProjectRepository projects; private final UserRepository users; private final CurrentUserService current;
 private final NotificationService notifications;
 public TaskService(TaskRepository tasks,ProjectRepository projects,UserRepository users,CurrentUserService current,NotificationService notifications){this.tasks=tasks;this.projects=projects;this.users=users;this.current=current;this.notifications=notifications;}
 public record TaskRequest(String title,String description,Long projectId,Long assigneeId,String priority,LocalDate dueDate){}
 public record TaskView(Long id,String title,String description,String status,String priority,LocalDate dueDate,Long projectId,String projectName,Long assigneeId,String assignee,String createdBy){}
 public List<TaskView> all(){
  AppUser u=current.get();
  List<Task> list=(u.getRole()==Role.ADMIN||u.getRole()==Role.MANAGER)?tasks.findAllByOrderByCreatedAtDesc():tasks.findByAssigneeIdOrderByCreatedAtDesc(u.getId());
  return list.stream().map(this::view).toList();
 }
 @Transactional
 public TaskView create(TaskRequest r){
  if(r.title()==null||r.title().isBlank()||r.projectId()==null||r.assigneeId()==null||r.dueDate()==null) throw new IllegalArgumentException("Title, project, assignee and due date are required");
  Project p=projects.findById(r.projectId()).orElseThrow(()->new IllegalArgumentException("Project not found"));
  AppUser a=users.findById(r.assigneeId()).orElseThrow(()->new IllegalArgumentException("Assignee not found"));
  Task t=new Task();t.setTitle(r.title().trim());t.setDescription(r.description());t.setProject(p);t.setAssignee(a);t.setCreatedBy(current.get());t.setDueDate(r.dueDate());
  try{t.setPriority(r.priority()==null?Priority.MEDIUM:Priority.valueOf(r.priority().toUpperCase()));}catch(Exception e){throw new IllegalArgumentException("Priority must be LOW, MEDIUM, HIGH or URGENT");}
  Task saved=tasks.save(t);
  notifications.create(a,"New task assigned","You were assigned to: "+saved.getTitle(),"TASK");
  return view(saved);
 }
 @Transactional
 public TaskView status(Long id,String raw){
  Task t=tasks.findById(id).orElseThrow(()->new IllegalArgumentException("Task not found"));
  AppUser me=current.get();
  if(me.getRole()!=Role.ADMIN&&me.getRole()!=Role.MANAGER&&!t.getAssignee().getId().equals(me.getId())) throw new org.springframework.security.access.AccessDeniedException("You can only update tasks assigned to you");
  try{t.setStatus(TaskStatus.valueOf(raw.toUpperCase()));}catch(Exception e){throw new IllegalArgumentException("Invalid task status");}
  return view(tasks.save(t));
 }
 @Transactional
 public TaskView assign(Long id,Long assigneeId){
  Task t=tasks.findById(id).orElseThrow(()->new IllegalArgumentException("Task not found"));
  AppUser a=users.findById(assigneeId).orElseThrow(()->new IllegalArgumentException("Assignee not found"));
  t.setAssignee(a);Task saved=tasks.save(t);
  notifications.create(a,"Task reassigned","You are now assigned to: "+saved.getTitle(),"TASK");
  return view(saved);
 }
 @Transactional
 public void delete(Long id){
  Task t=tasks.findById(id).orElseThrow(()->new IllegalArgumentException("Task not found"));
  AppUser me=current.get();
  if(me.getRole()!=Role.ADMIN&&me.getRole()!=Role.MANAGER&&!t.getAssignee().getId().equals(me.getId())) throw new org.springframework.security.access.AccessDeniedException("You cannot delete this task");
  tasks.delete(t);
 }
 private TaskView view(Task t){return new TaskView(t.getId(),t.getTitle(),t.getDescription(),t.getStatus().name(),t.getPriority().name(),t.getDueDate(),t.getProject().getId(),t.getProject().getName(),t.getAssignee().getId(),t.getAssignee().getFullName(),t.getCreatedBy().getFullName());}
}
