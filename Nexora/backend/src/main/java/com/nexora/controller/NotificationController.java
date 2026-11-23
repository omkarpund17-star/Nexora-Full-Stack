package com.nexora.controller;

import com.nexora.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
 private final NotificationService service;
 public NotificationController(NotificationService service){this.service=service;}
 @GetMapping public List<NotificationService.NotificationView> all(){return service.all();}
 @GetMapping("/unread-count") public Map<String,Long> unreadCount(){return Map.of("count",service.unreadCount());}
 @PatchMapping("/{id}/read") public ResponseEntity<Void> read(@PathVariable Long id){service.markRead(id);return ResponseEntity.noContent().build();}
 @PatchMapping("/read-all") public ResponseEntity<Void> readAll(){service.markAllRead();return ResponseEntity.noContent().build();}
}
