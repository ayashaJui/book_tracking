package com.biblioteca.userlibraryservice.util.mapper;

import com.biblioteca.userlibraryservice.dto.userBookEditions.UserBookEditionCreateDTO;
import com.biblioteca.userlibraryservice.dto.userBookEditions.UserBookEditionDTO;
import com.biblioteca.userlibraryservice.dto.userBookEditions.UserBookEditionUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserBookEdition;

import java.time.LocalDateTime;

public class UserBookEditionMapper {
    public static UserBookEditionDTO toDTO(UserBookEdition userBookEdition) {
        return UserBookEditionDTO.builder()
                .id(userBookEdition.getId())
                .userBookId(userBookEdition.getUserBook().getId())
                .catalogEditionId(userBookEdition.getCatalogEditionId())
                .isPrimaryEdition(userBookEdition.getIsPrimaryEdition())
                .condition(userBookEdition.getCondition())
                .storageLocation(userBookEdition.getStorageLocation())
                .acquisitionDate(userBookEdition.getAcquisitionDate())
                .acquisitionMethod(userBookEdition.getAcquisitionMethod())
                .purchasePrice(userBookEdition.getPurchasePrice())
                .purchaseCurrency(userBookEdition.getPurchaseCurrency())
                .purchaseLocation(userBookEdition.getPurchaseLocation())
                .notes(userBookEdition.getNotes())
                .createdAt(userBookEdition.getCreatedAt())
                .updatedAt(userBookEdition.getUpdatedAt())
                .build();
    }

    public static UserBookEdition fromCreateDTO(UserBookEditionCreateDTO userBookEditionCreateDTO) {
        return UserBookEdition.builder()
//                .catalogEditionId(userBookEditionCreateDTO.getCatalogEditionId())
                .isPrimaryEdition(userBookEditionCreateDTO.getIsPrimaryEdition())
                .condition(userBookEditionCreateDTO.getCondition())
                .storageLocation(userBookEditionCreateDTO.getStorageLocation())
                .acquisitionDate(userBookEditionCreateDTO.getAcquisitionDate())
                .acquisitionMethod(userBookEditionCreateDTO.getAcquisitionMethod())
                .purchasePrice(userBookEditionCreateDTO.getPurchasePrice())
                .purchaseCurrency(userBookEditionCreateDTO.getPurchaseCurrency())
                .purchaseLocation(userBookEditionCreateDTO.getPurchaseLocation())
                .notes(userBookEditionCreateDTO.getNotes())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserBookEdition fromUpdateDTO(UserBookEditionUpdateDTO userBookEditionUpdateDTO, UserBookEdition userBookEdition) {
//        userBookEdition.setCatalogEditionId(userBookEditionUpdateDTO.getCatalogEditionId());
        userBookEdition.setIsPrimaryEdition(userBookEditionUpdateDTO.getIsPrimaryEdition());
        userBookEdition.setCondition(userBookEditionUpdateDTO.getCondition());
        userBookEdition.setStorageLocation(userBookEditionUpdateDTO.getStorageLocation());
        userBookEdition.setAcquisitionDate(userBookEditionUpdateDTO.getAcquisitionDate());
        userBookEdition.setAcquisitionMethod(userBookEditionUpdateDTO.getAcquisitionMethod());
        userBookEdition.setPurchasePrice(userBookEditionUpdateDTO.getPurchasePrice());
        userBookEdition.setPurchaseCurrency(userBookEditionUpdateDTO.getPurchaseCurrency());
        userBookEdition.setPurchaseLocation(userBookEditionUpdateDTO.getPurchaseLocation());
        userBookEdition.setNotes(userBookEditionUpdateDTO.getNotes());
        userBookEdition.setUpdatedAt(LocalDateTime.now());

        return userBookEdition;
    }
}
