package com.biblioteca.authserver.util.enums;

public enum UserRegistrationAPIEnums {
    USER_REGISTRATION_API("register"),
    GET_REGISTERED_USER_INFO_API("get_registered_user_info");

    public final String value;

    UserRegistrationAPIEnums(String value) {
        this.value = value;
    }
}
