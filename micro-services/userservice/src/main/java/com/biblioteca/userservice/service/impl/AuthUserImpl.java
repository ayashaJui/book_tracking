package com.biblioteca.userservice.service.impl;

import com.biblioteca.userservice.repository.AuthUserRepository;
import com.biblioteca.userservice.service.AuthUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthUserImpl implements AuthUserService {
    private final AuthUserRepository authUserRepository;


}
