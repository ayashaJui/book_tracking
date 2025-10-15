package com.biblioteca.userlibraryservice.service.impl;

import com.biblioteca.userlibraryservice.dto.pagination.PageRequestDTO;
import com.biblioteca.userlibraryservice.dto.pagination.PaginationUtil;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userGenrePreferences.UserGenrePreferenceUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserAuthorPreference;
import com.biblioteca.userlibraryservice.entity.UserGenrePreference;
import com.biblioteca.userlibraryservice.repository.UserGenrePreferenceRepository;
import com.biblioteca.userlibraryservice.service.UserGenrePreferenceService;
import com.biblioteca.userlibraryservice.util.exception.CustomException;
import com.biblioteca.userlibraryservice.util.mapper.UserGenrePreferenceMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserGenrePreferenceServiceImpl implements UserGenrePreferenceService {
    private final UserGenrePreferenceRepository userGenrePreferenceRepository;


    @Override
    @Transactional
    public UserGenrePreferenceDTO createUserGenrePreference(UserGenrePreferenceCreateDTO createDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createUserGenrePreference in UserGenrePreferenceServiceImpl is called with data: {}", createDTO.toString());

        // TODO: after propagating catalog genre & user verify genreId & userId

        Optional<UserGenrePreference> existing = userGenrePreferenceRepository.findByUserIdAndCatalogGenreId(createDTO.getUserId(), createDTO.getCatalogGenreId());
        if (existing.isPresent()) {
            log.error("UserGenrePreferenceServiceImpl createUserGenrePreference exists in UserGenrePreferenceServiceImpl");
            throw new CustomException("User with this Genre already exist", CONFLICT.value());
        }

        UserGenrePreference userGenrePreference = fromCreateDTO(createDTO, createDTO.getUserId(), createDTO.getCatalogGenreId());

        try{
            userGenrePreferenceRepository.save(userGenrePreference);

            log.info("userGenrePreference created successfully");

            return convertToDTO(userGenrePreference);

        }catch(Exception e){
            log.error("createUserGenrePreference in UserGenrePreferenceServiceImpl exception: {}", e.getMessage());
            throw new CustomException("Error saving user Genre preference", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public Page<UserGenrePreferenceDTO> getUserGenresWithPaginationByUserId(PageRequestDTO pageRequestDTO, Integer userId, HttpServletRequest request, Jwt jwt) {
        log.info("getUserGenresWithPagination in UserAuthorPreferenceServiceImpl is called with userId: {}", userId);

        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(),  pageRequestDTO.getSize(), sort);

        // TODO: after propagation send catalog genre info with it.
        Page<UserGenrePreference> userGenrePreferences = userGenrePreferenceRepository.findByUserId(userId, pageable);

        Page<UserGenrePreferenceDTO> dtos = userGenrePreferences.map(this::convertToDTO);

        return dtos;
    }

    @Override
    public UserGenrePreferenceDTO getUserGenrePreferenceById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getUserGenrePreferenceById in UserGenrePreferenceServiceImpl is called with userId: {}", id);

        UserGenrePreference genrePreference = findById(id);

        return convertToDTO(genrePreference);
    }

    @Override
    @Transactional
    public UserGenrePreferenceDTO updateUserGenre(UserGenrePreferenceUpdateDTO updateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateUserGenre in UserGenrePreferenceServiceImpl is called with data: {}", updateDTO.toString());

        UserGenrePreference userGenrePreference = findById(updateDTO.getId());

        UserGenrePreference newUserGenrePreference = fromUpdateDTO(updateDTO, userGenrePreference);

//        TODO: after propagation set catalog genre
        newUserGenrePreference.setCatalogGenreId(userGenrePreference.getCatalogGenreId());

        try{
            userGenrePreferenceRepository.save(newUserGenrePreference);
            log.info("userGenrePreference updated successfully");
            return convertToDTO(newUserGenrePreference);

        }catch (Exception e){
            log.error("updateUserGenre in UserGenrePreferenceServiceImpl exception: {}", e.getMessage());
            throw new CustomException("Error saving user Genre preference", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    @Transactional
    public String deleteUserGenrePreference(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteUserGenrePreference in UserGenrePreferenceServiceImpl is called with userId: {}", id);

        UserGenrePreference userGenrePreference = findById(id);

        try {
            userGenrePreferenceRepository.delete(userGenrePreference);

            log.info("userGenrePreference delete successfully");

            return "deleted successfully";

        }catch (Exception e){
            log.error("deleteUserGenrePreference in UserGenrePreferenceServiceImpl exception: {}", e.getMessage());
            throw new CustomException("Error saving user Genre preference", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public List<UserGenrePreferenceDTO> getAllUserGenresByUserId(Integer userId, HttpServletRequest request, Jwt jwt) {
        log.info("getAllUserGenresByUserId in UserAuthorPreferenceServiceImpl is called with userId: {}", userId);

        List<UserGenrePreference> genrePreferences = userGenrePreferenceRepository.findByUserId(userId);

        return genrePreferences.stream().map(this::convertToDTO).toList();
    }

    private UserGenrePreference findById(Integer id){
        return userGenrePreferenceRepository.findById(id).orElseThrow(() -> {
            log.error("UserGenrePreference not found with id: {}", id);
            return new CustomException("Genre not found", HttpStatus.NOT_FOUND.value());
        });
    }

    private UserGenrePreferenceDTO convertToDTO(UserGenrePreference userGenrePreference){
        return UserGenrePreferenceMapper.toDTO(userGenrePreference);
    }

    private UserGenrePreference fromCreateDTO(UserGenrePreferenceCreateDTO userGenrePreferenceCreateDTO, Integer userId, Integer catalogGenreId) {
        return UserGenrePreferenceMapper.fromCreateDTO(userGenrePreferenceCreateDTO, userId, catalogGenreId);
    }

    private UserGenrePreference fromUpdateDTO(UserGenrePreferenceUpdateDTO userGenrePreferenceUpdateDTO, UserGenrePreference userGenrePreference){
        return UserGenrePreferenceMapper.fromUpdateDTO(userGenrePreferenceUpdateDTO, userGenrePreference);
    }
}
