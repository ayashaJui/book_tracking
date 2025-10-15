package com.biblioteca.userlibraryservice.service.impl;

import com.biblioteca.userlibraryservice.dto.pagination.PageRequestDTO;
import com.biblioteca.userlibraryservice.dto.pagination.PaginationUtil;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceCreateDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceDTO;
import com.biblioteca.userlibraryservice.dto.userAuthorPreferences.UserAuthorPreferenceUpdateDTO;
import com.biblioteca.userlibraryservice.entity.UserAuthorPreference;
import com.biblioteca.userlibraryservice.repository.UserAuthorPreferenceRepository;
import com.biblioteca.userlibraryservice.service.UserAuthorPreferenceService;
import com.biblioteca.userlibraryservice.util.exception.CustomException;
import com.biblioteca.userlibraryservice.util.mapper.UserAuthorPreferenceMapper;
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

import java.util.Optional;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserAuthorPreferenceServiceImpl implements UserAuthorPreferenceService {
    private final UserAuthorPreferenceRepository userAuthorPreferenceRepository;

    @Override
    @Transactional
    public UserAuthorPreferenceDTO createUserAuthorPreference(UserAuthorPreferenceCreateDTO createDTO, HttpServletRequest request, Jwt jwt) {
        log.info("createUserAuthorPreference in UserAuthorPreferenceServiceImpl is called with data: {}", createDTO.toString());

        // TODO: after propagating catalog author & user verify authorId & userId

        Optional<UserAuthorPreference> existing = userAuthorPreferenceRepository.findByUserIdAndCatalogAuthorId(createDTO.getUserId(), createDTO.getCatalogAuthorId());
        if (existing.isPresent()) {
            log.error("UserAuthorPreferenceServiceImpl createUserAuthorPreference exists in UserAuthorPreferenceServiceImpl");
            throw new CustomException("User with this author already exist", CONFLICT.value());
        }

        UserAuthorPreference userAuthorPreference = fromCreateDTO(createDTO, createDTO.getUserId(), createDTO.getCatalogAuthorId());

        try{
            userAuthorPreferenceRepository.save(userAuthorPreference);

            log.info("userAuthorPreference created successfully");

            return convertToDTO(userAuthorPreference);

        }catch(Exception e){
            log.error("createUserAuthorPreference in UserAuthorPreferenceServiceImpl exception: {}", e.getMessage());
            throw new CustomException("Error saving user author preference", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public Page<UserAuthorPreferenceDTO> getUserAuthorsWithPagination(PageRequestDTO pageRequestDTO, Integer userId, HttpServletRequest request, Jwt jwt) {
        log.info("getUserAuthorsWithPagination in UserAuthorPreferenceServiceImpl is called with userId: {}", userId);

        Sort sort = Sort.by(Sort.Direction.DESC, "id");

        Pageable pageable = PaginationUtil.getPageableSorted(pageRequestDTO.getPage(),  pageRequestDTO.getSize(), sort);

        // TODO: after propagation send catalog author info with it.
        Page<UserAuthorPreference> userAuthorPreferences = userAuthorPreferenceRepository.findByUserId(userId, pageable);

        Page<UserAuthorPreferenceDTO> dtos = userAuthorPreferences.map(this::convertToDTO);

        return dtos;
    }

    @Override
    public UserAuthorPreferenceDTO getUserAuthorPreferenceById(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("getUserAuthorPreferenceById in UserAuthorPreferenceServiceImpl is called with userId: {}", id);

        UserAuthorPreference authorPreference = findById(id);

        return convertToDTO(authorPreference);
    }

    @Override
    @Transactional
    public UserAuthorPreferenceDTO updateUserAuthor(UserAuthorPreferenceUpdateDTO updateDTO, HttpServletRequest request, Jwt jwt) {
        log.info("updateUserAuthor in UserAuthorPreferenceServiceImpl is called with data: {}", updateDTO.toString());

        UserAuthorPreference userAuthorPreference = findById(updateDTO.getId());

        UserAuthorPreference newUserAuthorPreference = fromUpdateDTO(updateDTO, userAuthorPreference);

//        TODO: after propagation set catalog author
        newUserAuthorPreference.setCatalogAuthorId(userAuthorPreference.getCatalogAuthorId());

        try{
            userAuthorPreferenceRepository.save(newUserAuthorPreference);
            log.info("userAuthorPreference updated successfully");
            return convertToDTO(newUserAuthorPreference);

        }catch (Exception e){
            log.error("updateUserAuthor in UserAuthorPreferenceServiceImpl exception: {}", e.getMessage());
            throw new CustomException("Error saving user author preference", INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    @Transactional
    public String deleteUserAuthorPreference(Integer id, HttpServletRequest request, Jwt jwt) {
        log.info("deleteUserAuthorPreference in UserAuthorPreferenceServiceImpl is called with userId: {}", id);

        UserAuthorPreference userAuthorPreference = findById(id);

        try {
            userAuthorPreferenceRepository.delete(userAuthorPreference);

            log.info("userAuthorPreference delete successfully");

            return "deleted successfully";

        }catch (Exception e){
            log.error("deleteUserAuthorPreference in UserAuthorPreferenceServiceImpl exception: {}", e.getMessage());
            throw new CustomException("Error saving user author preference", INTERNAL_SERVER_ERROR.value());
        }
    }

    private UserAuthorPreference findById(Integer id){
        log.info("getUserAuthorPreferenceById in UserAuthorPreferenceServiceImpl is called with id: {}", id);

        return userAuthorPreferenceRepository.findById(id).orElseThrow(() -> {
            log.error("Author not found with id: {}", id);
            return new CustomException("Author not found", INTERNAL_SERVER_ERROR.value());
        });
    }


    private UserAuthorPreferenceDTO convertToDTO(UserAuthorPreference userAuthorPreference) {
        return UserAuthorPreferenceMapper.toDTO(userAuthorPreference);
    }

    private UserAuthorPreference fromCreateDTO(UserAuthorPreferenceCreateDTO createDTO, Integer userId, Integer catalogAuthorId) {
        return UserAuthorPreferenceMapper.fromCreateDTO(createDTO, userId, catalogAuthorId);
    }

    private UserAuthorPreference fromUpdateDTO(UserAuthorPreferenceUpdateDTO updateDTO, UserAuthorPreference userAuthorPreference) {
        return UserAuthorPreferenceMapper.fromUpdateDTO(updateDTO, userAuthorPreference);
    }
}
