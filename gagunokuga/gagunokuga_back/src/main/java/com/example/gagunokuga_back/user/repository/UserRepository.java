package com.example.gagunokuga_back.user.repository;

import com.example.gagunokuga_back.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    User findByEmail(String email);
}
