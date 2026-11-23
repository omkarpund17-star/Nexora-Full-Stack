package com.nexora.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, unique=true, length=180) private String email;
 @Column(nullable=false) private String password;
 @Column(nullable=false, length=100) private String fullName;
 @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Role role;
 @Column(length=100) private String title;
 @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public String getEmail(){return email;}
 public void setEmail(String v){email=v==null?null:v.trim().toLowerCase();}
 public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
 public Role getRole(){return role;} public void setRole(Role v){role=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
