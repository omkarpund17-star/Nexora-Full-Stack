package com.nexora.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="tasks")
public class Task {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=160) private String title;
 @Column(length=1000) private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private TaskStatus status=TaskStatus.TODO;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Priority priority=Priority.MEDIUM;
 @Column(nullable=false) private LocalDate dueDate;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id") private Project project;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="assignee_id") private AppUser assignee;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="created_by_id") private AppUser createdBy;
 @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public TaskStatus getStatus(){return status;} public void setStatus(TaskStatus v){status=v;}
 public Priority getPriority(){return priority;} public void setPriority(Priority v){priority=v;}
 public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate v){dueDate=v;}
 public Project getProject(){return project;} public void setProject(Project v){project=v;}
 public AppUser getAssignee(){return assignee;} public void setAssignee(AppUser v){assignee=v;}
 public AppUser getCreatedBy(){return createdBy;} public void setCreatedBy(AppUser v){createdBy=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
