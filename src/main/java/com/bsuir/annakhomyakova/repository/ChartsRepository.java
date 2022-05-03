package com.bsuir.annakhomyakova.repository;

import com.bsuir.annakhomyakova.domain.ChartsAnnKh;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChartsAnnKh entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChartsRepository extends JpaRepository<ChartsAnnKh, Long> {}
