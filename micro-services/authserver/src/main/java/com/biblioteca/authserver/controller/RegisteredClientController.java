package com.biblioteca.authserver.controller;

import com.biblioteca.authserver.dto.RegisteredClientCreateDTO;
import com.biblioteca.authserver.dto.RegisteredClientResponseDTO;
import com.biblioteca.authserver.service.RegisteredClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class RegisteredClientController {
    private final RegisteredClientService registeredClientService;

    @PostMapping("/register")
    public ResponseEntity<RegisteredClientResponseDTO> registerClient(@RequestBody RegisteredClientCreateDTO clientCreateDTO) {
        RegisteredClientResponseDTO dto = registeredClientService.registerClient(clientCreateDTO);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

}
