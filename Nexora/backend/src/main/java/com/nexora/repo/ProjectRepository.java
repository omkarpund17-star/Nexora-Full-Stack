package com.nexora.repo;
import com.nexora.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProjectRepository extends JpaRepository<Project,Long> {
 List<Project> findAllByOrderByCreatedAtDesc();
}
