package com.villabook.repository;

import com.villabook.entity.Booking;
import com.villabook.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b " +
           "WHERE b.villa.id = :villaId " +
           "AND b.status != :cancelledStatus " +
           "AND b.checkIn < :checkOut " +
           "AND b.checkOut > :checkIn")
    List<Booking> findOverlappingBookings(
            @Param("villaId") Long villaId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("cancelledStatus") BookingStatus cancelledStatus
    );

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    long countByStatus(BookingStatus status);

    long countByUserId(Long userId);
}
