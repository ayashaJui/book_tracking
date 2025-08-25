package com.biblioteca.authserver.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition
public class OpenApiConfig {
    @Bean
    public OpenAPI apiInfo() {
        final String securitySchemeName = "Access Token for Doha Securities";
        return new OpenAPI().addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components().addSecuritySchemes(securitySchemeName, new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")))
                .info(new Info()
                        .title("Auth Server")
                        .version("v1.0")
                        .description("API Documentation for Auth Server Version 1.0")
                        .termsOfService(null)
                        .license(getLicense()));
    }

    private License getLicense() {
        License license = new License();
        license.setName("Doha Securities");
        license.setUrl("#");
        return license;
    }
}
