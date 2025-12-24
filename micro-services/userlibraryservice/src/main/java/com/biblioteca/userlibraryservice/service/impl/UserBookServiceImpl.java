package com.biblioteca.userlibraryservice.service.impl;

import com.biblioteca.userlibraryservice.dto.userBooks.UserBookCreateDTO;
import com.biblioteca.userlibraryservice.dto.userBooks.UserBookDTO;
import com.biblioteca.userlibraryservice.entity.UserBook;
import com.biblioteca.userlibraryservice.repository.UserBookRepository;
import com.biblioteca.userlibraryservice.service.UserBookService;
import com.biblioteca.userlibraryservice.util.exception.CustomException;
import com.biblioteca.userlibraryservice.util.mapper.UserBookMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserBookServiceImpl implements UserBookService {
    private final UserBookRepository userBookRepository;

    @Override
    @Transactional
    public UserBookDTO createUserBook(UserBookCreateDTO createDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createUserBook method in UserBookServiceImpl is called with data: {}", createDTO.toString());

        // TODO: after propagating catalog book & user verify bookId & userId

        Optional<UserBook> existing = userBookRepository.findByUserIdAndCatalogBookId(createDTO.getUserId(), createDTO.getCatalogBookId());
        if (existing.isPresent()) {
            log.error("UserBook already exists in UserBookServiceImpl");
            throw new CustomException("Book already exist for user", HttpStatus.CONFLICT.value());
        }

        UserBook userBook = fromCreateDTO(createDTO);

        if(createDTO.getBookPageCount() != null && createDTO.getBookPageCount() > 0 && createDTO.getCurrentPage() != null && createDTO.getCurrentPage() > 0) {
            BigDecimal booksRead = BigDecimal.valueOf(createDTO.getCurrentPage());
            BigDecimal totalBooks = BigDecimal.valueOf(createDTO.getBookPageCount());

            BigDecimal progressPercentage = booksRead
                    .divide(totalBooks, 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            userBook.setProgressPercentage(progressPercentage);
        }else{
            userBook.setProgressPercentage(null);
        }

        userBook.setUserId(createDTO.getUserId());
        userBook.setCatalogBookId(createDTO.getCatalogBookId());

        try{
            userBookRepository.save(userBook);
            log.info("UserBook created successfully in UserBookServiceImpl");
            return UserBookMapper.toDTO(userBook);
        }catch (Exception e){
            log.error("Error occurred while creating UserBook in UserBookServiceImpl: {}", e.getMessage());
            throw new CustomException("Failed to create UserBook", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private UserBook fromCreateDTO(UserBookCreateDTO createDTO){
        return UserBookMapper.fromCreateDTO(createDTO);
    }
}
