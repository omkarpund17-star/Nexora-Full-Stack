package com.nexora.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="projects")
public class Project {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=140) private String name;
 @Column(length=800) private String description;
 @Column(nullable=false,length=50) private String client;
 @Column(nullable=false,length=30) private String status="ACTIVE";
 @Column(nullable=false) private LocalDate dueDate;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="owner_id") private AppUser owner;
 @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public String getClient(){return client;} public void setClient(String v){client=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate v){dueDate=v;}
 public AppUser getOwner(){return owner;} public void setOwner(AppUser v){owner=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
