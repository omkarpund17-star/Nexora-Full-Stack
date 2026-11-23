package com.nexora.repo;

import com.nexora.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification,Long> {
 List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
 long countByRecipientIdAndReadFalse(Long recipientId);
}
