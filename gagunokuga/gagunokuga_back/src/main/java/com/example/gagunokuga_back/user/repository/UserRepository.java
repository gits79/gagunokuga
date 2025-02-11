package com.example.gagunokuga_back.user.repository;

import com.example.gagunokuga_back.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    User findByEmail(String email);

    List<User> findByNicknameContaining(String searchword);

    Optional<User> findByNickname(String nickname);
}
