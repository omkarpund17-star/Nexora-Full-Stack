package com.nexora.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 @ManyToOne(fetch = FetchType.LAZY, optional = false)
 @JoinColumn(name = "recipient_id")
 private AppUser recipient;
 @Column(nullable=false,length=180)
 private String title;
 @Column(nullable=false,length=500)
 private String message;
 @Column(nullable=false,length=30)
 private String type="GENERAL";
 @Column(nullable=false)
 private boolean read=false;
 @Column(nullable=false)
 private LocalDateTime createdAt=LocalDateTime.now();

 public Long getId(){return id;}
 public AppUser getRecipient(){return recipient;} public void setRecipient(AppUser recipient){this.recipient=recipient;}
 public String getTitle(){return title;} public void setTitle(String title){this.title=title;}
 public String getMessage(){return message;} public void setMessage(String message){this.message=message;}
 public String getType(){return type;} public void setType(String type){this.type=type;}
 public boolean isRead(){return read;} public void setRead(boolean read){this.read=read;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
