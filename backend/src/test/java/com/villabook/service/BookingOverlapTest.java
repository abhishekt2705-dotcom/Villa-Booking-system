package com.villabook.service;

import com.villabook.dto.AvailabilityResponse;
import com.villabook.entity.Booking;
import com.villabook.entity.BookingStatus;
import com.villabook.entity.Villa;
import com.villabook.entity.VillaStatus;
import com.villabook.exception.BadRequestException;
import com.villabook.repository.BookingRepository;
import com.villabook.repository.VillaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BookingOverlapTest {

    @Mock
    private VillaRepository villaRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private VillaService villaService;

    private Villa testVilla;

    @BeforeEach
    void setUp() {
        testVilla = new Villa(
                1L,
                "Villa Paradise",
                "Beachfront villa",
                "Goa",
                new BigDecimal("5000.00"),
                4,
                "https://example.com/photo.jpg",
                VillaStatus.ACTIVE
        );
    }

    @Test
    @DisplayName("Should return available when there are no overlapping bookings")
    void testAvailability_WhenNoOverlap_ReturnsAvailable() {
        LocalDate checkIn = LocalDate.of(2026, 10, 20);
        LocalDate checkOut = LocalDate.of(2026, 10, 25);

        when(villaRepository.findById(1L)).thenReturn(Optional.of(testVilla));
        when(bookingRepository.findOverlappingBookings(eq(1L), eq(checkIn), eq(checkOut), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        AvailabilityResponse response = villaService.checkAvailability(1L, checkIn, checkOut);

        assertTrue(response.isAvailable());
        assertEquals("Villa is available!", response.getMessage());
        assertEquals(5, response.getNights());
        assertEquals(new BigDecimal("25000.00"), response.getTotalAmount());
    }

    @Test
    @DisplayName("Should return unavailable when overlapping bookings exist")
    void testAvailability_WhenOverlapsExist_ReturnsUnavailable() {
        LocalDate checkIn = LocalDate.of(2026, 10, 12);
        LocalDate checkOut = LocalDate.of(2026, 10, 18);

        Booking existingBooking = new Booking();
        existingBooking.setId(100L);
        existingBooking.setCheckIn(LocalDate.of(2026, 10, 10));
        existingBooking.setCheckOut(LocalDate.of(2026, 10, 15));
        existingBooking.setStatus(BookingStatus.CONFIRMED);

        when(villaRepository.findById(1L)).thenReturn(Optional.of(testVilla));
        when(bookingRepository.findOverlappingBookings(eq(1L), eq(checkIn), eq(checkOut), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(existingBooking));

        AvailabilityResponse response = villaService.checkAvailability(1L, checkIn, checkOut);

        assertFalse(response.isAvailable());
        assertEquals("Villa is not available for the selected dates.", response.getMessage());
    }

    @Test
    @DisplayName("Should throw BadRequestException when checkout is before or equal to checkin")
    void testAvailability_InvalidDates_ThrowsException() {
        LocalDate checkIn = LocalDate.of(2026, 10, 20);
        LocalDate checkOut = LocalDate.of(2026, 10, 20);

        assertThrows(BadRequestException.class, () -> {
            villaService.checkAvailability(1L, checkIn, checkOut);
        });
    }
}
