package com.nexora.service;

import com.nexora.model.*;
import com.nexora.repo.*;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class DashboardService {
 private final ProjectRepository projects; private final TaskRepository tasks; private final UserRepository users; private final CurrentUserService current;
 public DashboardService(ProjectRepository p,TaskRepository t,UserRepository u,CurrentUserService c){projects=p;tasks=t;users=u;current=c;}
 public Map<String,Object> summary(){
  AppUser me=current.get(); Map<String,Object> m=new LinkedHashMap<>();
  m.put("projects",projects.count());m.put("teamMembers",users.count());m.put("totalTasks",tasks.count());
  m.put("doneTasks",tasks.countByStatus(TaskStatus.DONE));m.put("inProgressTasks",tasks.countByStatus(TaskStatus.IN_PROGRESS));
  m.put("myTasks",tasks.findByAssigneeIdOrderByCreatedAtDesc(me.getId()).size());return m;
 }
}
