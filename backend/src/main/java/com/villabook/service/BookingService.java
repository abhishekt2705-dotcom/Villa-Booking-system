package com.villabook.service;

import com.villabook.dto.BookingRequest;
import com.villabook.dto.BookingResponse;
import com.villabook.entity.*;
import com.villabook.exception.BadRequestException;
import com.villabook.exception.ResourceNotFoundException;
import com.villabook.repository.BookingRepository;
import com.villabook.repository.UserRepository;
import com.villabook.repository.VillaRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VillaRepository villaRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          VillaRepository villaRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.villaRepository = villaRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new BadRequestException("Check-out date must be strictly after check-in date");
        }

        Villa villa = villaRepository.findById(request.getVillaId())
                .orElseThrow(() -> new ResourceNotFoundException("Villa not found with id: " + request.getVillaId()));

        if (villa.getStatus() != VillaStatus.ACTIVE) {
            throw new BadRequestException("Cannot book an inactive villa.");
        }

        // Re-check availability on backend to prevent double-booking race conditions
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                villa.getId(),
                request.getCheckIn(),
                request.getCheckOut(),
                BookingStatus.CANCELLED
        );

        if (!overlapping.isEmpty()) {
            throw new BadRequestException("Villa is not available for the selected dates. Please choose different dates.");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        if (nights <= 0) {
            throw new BadRequestException("Minimum stay is 1 night");
        }

        BigDecimal totalAmount = villa.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVilla(villa);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.fromEntity(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelBooking(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingResponse.fromEntity(updatedBooking);
    }
}
