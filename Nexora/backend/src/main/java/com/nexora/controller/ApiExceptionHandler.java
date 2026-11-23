package com.nexora.controller;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class)
 ResponseEntity<Map<String,String>> badRequest(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
 @ExceptionHandler(AccessDeniedException.class)
 ResponseEntity<Map<String,String>> forbidden(AccessDeniedException e){return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","You do not have permission to perform this action."));}
 @ExceptionHandler(MethodArgumentNotValidException.class)
 ResponseEntity<Map<String,String>> validation(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("message","Please check the submitted fields."));}
 @ExceptionHandler(Exception.class)
 ResponseEntity<Map<String,String>> unexpected(Exception e){return ResponseEntity.status(500).body(Map.of("message","Unexpected server error. Check backend logs."));}
}
