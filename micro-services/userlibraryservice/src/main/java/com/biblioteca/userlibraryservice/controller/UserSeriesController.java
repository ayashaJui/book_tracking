package com.biblioteca.userlibraryservice.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@Tag(name = "1. User Series Controller", description = "User Series Related APIs")
@RequestMapping("/v1/user_series")
public class UserSeriesController {
}
