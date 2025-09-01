package com.biblioteca.userservice.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.*;
import java.util.Set;
import java.util.stream.Collectors;

@Converter
public class SimpleGrantedAuthorityConverter implements AttributeConverter<Set<SimpleGrantedAuthority>, String> {
    private static final String DELIMITER = ",";

    @Override
    public String convertToDatabaseColumn(Set<SimpleGrantedAuthority> authorities) {
        if (authorities == null || authorities.isEmpty()) return "";
        return authorities.stream()
                .map(SimpleGrantedAuthority::getAuthority)
                .collect(Collectors.joining(DELIMITER));
    }

    @Override
    public Set<SimpleGrantedAuthority> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return Collections.emptySet();
        return Arrays.stream(dbData.split(DELIMITER))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }
}
