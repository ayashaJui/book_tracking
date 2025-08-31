package com.biblioteca.userservice.util.mapper;

import org.apache.commons.lang3.function.TriFunction;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.BiFunction;

@Component
public class GenericMapper {
    public <S, D> D toDTO(S source, java.util.function.Function<S, D> builderFunction) {
        return builderFunction.apply(source);
    }

    public <S, D> List<D> toDTO(java.util.List<S> sourceList, java.util.function.Function<S, D> builderFunction) {
        return sourceList.stream().map(builderFunction).collect(java.util.stream.Collectors.toList());
    }

    public <S, U, D> D fromUpdateDTO(S source, U updateDTO, java.util.function.BiFunction<S, U, D> builderFunction) {
        return builderFunction.apply(source, updateDTO);
    }

    public <S, D> D fromCreateDTO(S source, java.util.function.Function<S, D> builderFunction) {
        return builderFunction.apply(source);
    }

    public <S, P,U, D> D toUserDetails(S clientId,P password ,U authorities, TriFunction<S,P, U, D> builderFunction) {
        return builderFunction.apply(clientId, password,authorities);
    }

    public <S, U, D> D fromUserDetails(S userDetails, U authUser, BiFunction<S, U, D> builderFunction) {
        return builderFunction.apply(userDetails, authUser);
    }
}
