package com.nexora.service;

import com.nexora.model.AppUser;
import com.nexora.model.Notification;
import com.nexora.repo.NotificationRepository;
import com.nexora.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
 private final NotificationRepository notifications;
 private final UserRepository users;
 private final CurrentUserService current;

 public NotificationService(NotificationRepository notifications,UserRepository users,CurrentUserService current){
  this.notifications=notifications; this.users=users; this.current=current;
 }
 public record NotificationView(Long id,String title,String message,String type,boolean read,LocalDateTime createdAt){}

 public List<NotificationView> all(){
  Long recipientId=current.get().getId();
  return notifications.findByRecipientIdOrderByCreatedAtDesc(recipientId).stream().map(this::view).toList();
 }
 public long unreadCount(){return notifications.countByRecipientIdAndReadFalse(current.get().getId());}

 @Transactional
 public void markRead(Long id){
  Notification n=notifications.findById(id).orElseThrow(()->new IllegalArgumentException("Notification not found"));
  if(!n.getRecipient().getId().equals(current.get().getId())) throw new IllegalArgumentException("Notification not found");
  n.setRead(true); notifications.save(n);
 }
 @Transactional
 public void markAllRead(){
  notifications.findByRecipientIdOrderByCreatedAtDesc(current.get().getId()).forEach(n->{n.setRead(true);notifications.save(n);});
 }
 public void create(AppUser recipient,String title,String message,String type){
  Notification n=new Notification(); n.setRecipient(recipient); n.setTitle(title); n.setMessage(message); n.setType(type);
  notifications.save(n);
 }
 private NotificationView view(Notification n){
  return new NotificationView(n.getId(),n.getTitle(),n.getMessage(),n.getType(),n.isRead(),n.getCreatedAt());
 }
}
