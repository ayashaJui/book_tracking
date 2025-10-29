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
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserSeriesServiceImpl implements UserSeriesService {
    private final UserSeriesRepository userSeriesRepository;


    @Override
    @Transactional
    public UserSeriesDTO createUserSeries(UserSeriesCreateDTO userSeriesCreateDTO, HttpServletRequest request, Jwt jwt) {
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

    @Override
    public List<UserSeriesDTO> getAllUserSeriesByUserId(Integer userId, HttpServletRequest request, Jwt jwt) {
        log.info("getAllUserSeriesByUserId method in UserSeriesServiceImpl is called with userId: {}", userId);

        List<UserSeries> userSeriesList = userSeriesRepository.findByUserId(userId);

        List<UserSeriesDTO> dtoList = userSeriesList.stream().map(this::convertToDTO).toList();

        log.info("UserSeries by userId is retrieved successfully in UserSeriesServiceImpl");

        return dtoList;
    }

    @Override
    public UserSeriesDTO getUserSeriesById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getUserSeriesById method in UserSeriesServiceImpl is called with id: {}", id);

        UserSeries userSeries = findById(id);

        UserSeriesDTO dto = convertToDTO(userSeries);

        return dto;
    }

    @Override
    @Transactional
    public UserSeriesDTO updateUserSeries(UserSeriesUpdateDTO userSeriesUpdateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateUserSeries method in UserSeriesServiceImpl is called with data: {}", userSeriesUpdateDTO.toString());

        UserSeries existing = findById(userSeriesUpdateDTO.getUserId());

        if(!Objects.equals(existing.getUserId(), userSeriesUpdateDTO.getUserId()) && !Objects.equals(existing.getCatalogSeriesId(), userSeriesUpdateDTO.getCatalogSeriesId())){
            log.error("UserSeries update can not be performed on different user series");
            throw new CustomException("This action is not allowed", HttpStatus.BAD_REQUEST.value());
        }

        UserSeries newUserSeries = fromUpdateDTO(userSeriesUpdateDTO, existing);

        if(userSeriesUpdateDTO.getSeriesTotalBooks() != null && userSeriesUpdateDTO.getSeriesTotalBooks() > 0 && userSeriesUpdateDTO.getBooksRead() != null && userSeriesUpdateDTO.getBooksRead() > 0) {
            BigDecimal booksRead = BigDecimal.valueOf(userSeriesUpdateDTO.getBooksRead());
            BigDecimal totalBooks = BigDecimal.valueOf(userSeriesUpdateDTO.getSeriesTotalBooks());

            BigDecimal completionPercentage = booksRead
                    .divide(totalBooks, 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            newUserSeries.setCompletionPercentage(completionPercentage);
        }else{
            newUserSeries.setCompletionPercentage(null);
        }

        try{
            userSeriesRepository.save(newUserSeries);
            log.info("UserSeries updated successfully in UserSeriesServiceImpl");
            return convertToDTO(newUserSeries);
        }catch (Exception e){
            log.error("exception in updating user series: {}", e.getMessage());
            throw new CustomException("Error in updating user series", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    @Transactional
    public String deleteUserSeries(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteUserSeries method in UserSeriesServiceImpl is called with id: {}", id);

        UserSeries userSeries = findById(id);

        try {
            userSeriesRepository.delete(userSeries);
            log.info("UserSeries deleted successfully in UserSeriesServiceImpl");
            return "delete successfully";
        }catch (Exception e){
            log.error("exception in deleting user series: {}", e.getMessage());
            throw new CustomException("Error in deleting user series", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private UserSeries findById(Integer id){
        return userSeriesRepository.findById(id).orElseThrow(() -> {
            log.error("UserSeries id not found in UserSeriesServiceImpl");
            return new CustomException("UserSeries id not found in UserSeriesServiceImpl", HttpStatus.NOT_FOUND.value());
        });
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
