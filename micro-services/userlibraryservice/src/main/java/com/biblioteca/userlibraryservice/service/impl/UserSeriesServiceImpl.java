package com.biblioteca.userlibraryservice.service.impl;

import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesCreateDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesDTO;
import com.biblioteca.userlibraryservice.dto.userSeries.UserSeriesUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserSeries;
import com.biblioteca.userlibraryservice.repository.UserSeriesRepository;
import com.biblioteca.userlibraryservice.service.UserSeriesService;
import com.biblioteca.userlibraryservice.util.exception.CustomException;
import com.biblioteca.userlibraryservice.util.mapper.UserSeriesMapper;
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
@Slf4j
@RequiredArgsConstructor
public class UserSeriesServiceImpl implements UserSeriesService {
    private final UserSeriesRepository userSeriesRepository;


    @Override
    @Transactional
    public UserSeriesDTO createUserSeries(UserSeriesCreateDTO userSeriesCreateDTO, HttpServletRequest httpServletRequest, Jwt jwt) {
        log.info("createUserSeries method in UserSeriesServiceImpl is called with data: {}", userSeriesCreateDTO.toString());

        // TODO: after propagating catalog genre & user verify genreId & userId

        Optional<UserSeries> existing = userSeriesRepository.findByUserIdAndCatalogSeriesId(userSeriesCreateDTO.getUserId(), userSeriesCreateDTO.getCatalogSeriesId());
        if (existing.isPresent()) {
            log.error("UserSeries already exists in UserSeriesServiceImpl");
            throw new CustomException("Series already exist for user", HttpStatus.CONFLICT.value());
        }

        UserSeries userSeries = fromCreateDTO(userSeriesCreateDTO);

        if(userSeriesCreateDTO.getSeriesTotalBooks() != null && userSeriesCreateDTO.getSeriesTotalBooks() > 0 && userSeriesCreateDTO.getBooksRead() != null && userSeriesCreateDTO.getBooksRead() > 0) {
            BigDecimal booksRead = BigDecimal.valueOf(userSeriesCreateDTO.getBooksRead());
            BigDecimal totalBooks = BigDecimal.valueOf(userSeriesCreateDTO.getSeriesTotalBooks());

            BigDecimal completionPercentage = booksRead
                    .divide(totalBooks, 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            userSeries.setCompletionPercentage(completionPercentage);
        }else{
            userSeries.setCompletionPercentage(null);
        }

        userSeries.setUserId(userSeriesCreateDTO.getUserId());
        userSeries.setCatalogSeriesId(userSeriesCreateDTO.getCatalogSeriesId());

        try{
            userSeriesRepository.save(userSeries);

            log.info("UserSeries created successfully in UserSeriesServiceImpl");

            return convertToDTO(userSeries);

        }catch (Exception e){
            log.error("exception in creating user series: {}", e.getMessage());
            throw new CustomException("Error in creating user series", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private UserSeries fromCreateDTO(UserSeriesCreateDTO userSeriesCreateDTO) {
        return UserSeriesMapper.fromCreateDTO(userSeriesCreateDTO);
    }

    private UserSeries fromUpdateDTO(UserSeriesUpdateDTO userSeriesUpdateDTO, UserSeries userSeries) {
        return UserSeriesMapper.fromUpdateDTO(userSeriesUpdateDTO, userSeries);
    }

    private UserSeriesDTO convertToDTO(UserSeries userSeries) {
        return UserSeriesMapper.toDTO(userSeries);
    }
}
