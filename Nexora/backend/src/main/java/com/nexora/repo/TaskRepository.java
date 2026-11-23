package com.nexora.repo;
import com.nexora.model.Task;
import com.nexora.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task,Long> {
 List<Task> findAllByOrderByCreatedAtDesc();
 List<Task> findByAssigneeIdOrderByCreatedAtDesc(Long id);
 long countByStatus(TaskStatus status);
 long countByProjectId(Long projectId);
}
