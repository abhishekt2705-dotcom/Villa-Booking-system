package com.villabook.service;

import com.villabook.dto.AvailabilityResponse;
import com.villabook.dto.VillaDTO;
import com.villabook.entity.Booking;
import com.villabook.entity.BookingStatus;
import com.villabook.entity.Villa;
import com.villabook.entity.VillaStatus;
import com.villabook.exception.BadRequestException;
import com.villabook.exception.ResourceNotFoundException;
import com.villabook.repository.BookingRepository;
import com.villabook.repository.VillaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VillaService {

    private final VillaRepository villaRepository;
    private final BookingRepository bookingRepository;

    public VillaService(VillaRepository villaRepository, BookingRepository bookingRepository) {
        this.villaRepository = villaRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<VillaDTO> getActiveVillas() {
        return villaRepository.findByStatusOrderByIdDesc(VillaStatus.ACTIVE)
                .stream()
                .map(VillaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VillaDTO getVillaById(Long id) {
        Villa villa = villaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Villa not found with id: " + id));
        return VillaDTO.fromEntity(villa);
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse checkAvailability(Long villaId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        if (!checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        Villa villa = villaRepository.findById(villaId)
                .orElseThrow(() -> new ResourceNotFoundException("Villa not found with id: " + villaId));

        if (villa.getStatus() != VillaStatus.ACTIVE) {
            return new AvailabilityResponse(
                    false,
                    "This villa is currently inactive and cannot be booked.",
                    villaId,
                    checkIn,
                    checkOut,
                    0,
                    villa.getPricePerNight(),
                    BigDecimal.ZERO
            );
        }

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                villaId,
                checkIn,
                checkOut,
                BookingStatus.CANCELLED
        );

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal totalAmount = villa.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        if (!overlapping.isEmpty()) {
            return new AvailabilityResponse(
                    false,
                    "Villa is not available for the selected dates.",
                    villaId,
                    checkIn,
                    checkOut,
                    nights,
                    villa.getPricePerNight(),
                    totalAmount
            );
        }

        return new AvailabilityResponse(
                true,
                "Villa is available!",
                villaId,
                checkIn,
                checkOut,
                nights,
                villa.getPricePerNight(),
                totalAmount
        );
    }
}
