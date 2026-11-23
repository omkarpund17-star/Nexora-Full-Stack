package com.nexora.security;

import com.nexora.repo.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
 private final JwtService jwtService; private final UserRepository users;
 public JwtAuthFilter(JwtService jwtService,UserRepository users){this.jwtService=jwtService;this.users=users;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)
  throws ServletException,IOException {
  String h=req.getHeader("Authorization");
  if(h!=null && h.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication()==null){
   try {
    String email=jwtService.subject(h.substring(7));
    users.findByEmail(email).ifPresent(u -> {
     var auth=new UsernamePasswordAuthenticationToken(u.getEmail(),null,
       List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole().name())));
     SecurityContextHolder.getContext().setAuthentication(auth);
    });
   } catch(Exception ignored) { /* invalid/expired token is treated as unauthenticated */ }
  }
  chain.doFilter(req,res);
 }
}
