package com.biblioteca.userservice.dto.authUser;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuthUserDTO {
    private Integer id;
    private String emailAddress;

    private Set<String> authorities;

    private LocalDateTime otpDate;

    private Integer otpRetryCount;

}
