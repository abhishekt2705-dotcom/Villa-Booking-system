package com.villabook.controller;

import com.villabook.dto.BookingRequest;
import com.villabook.dto.BookingResponse;
import com.villabook.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(Authentication authentication,
                                                         @Valid @RequestBody BookingRequest request) {
        String email = authentication.getName();
        BookingResponse response = bookingService.createBooking(email, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        List<BookingResponse> bookings = bookingService.getMyBookings(email);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(Authentication authentication,
                                                         @PathVariable Long id) {
        String email = authentication.getName();
        BookingResponse response = bookingService.cancelBooking(email, id);
        return ResponseEntity.ok(response);
    }
}
