package com.villabook.repository;

import com.villabook.entity.Villa;
import com.villabook.entity.VillaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VillaRepository extends JpaRepository<Villa, Long> {
    List<Villa> findByStatus(VillaStatus status);
    List<Villa> findAllByOrderByIdDesc();
    List<Villa> findByStatusOrderByIdDesc(VillaStatus status);
}
