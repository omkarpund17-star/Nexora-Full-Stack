package com.nexora.controller;
import com.nexora.service.DashboardService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
 private final DashboardService service;
 public DashboardController(DashboardService s){service=s;}
 @GetMapping("/summary") public Map<String,Object> summary(){return service.summary();}
}
