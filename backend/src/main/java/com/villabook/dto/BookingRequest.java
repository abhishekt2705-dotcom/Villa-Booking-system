package com.villabook.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequest {

    @NotNull(message = "Villa ID is required")
    private Long villaId;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOut;

    public BookingRequest() {
    }

    public BookingRequest(Long villaId, LocalDate checkIn, LocalDate checkOut) {
        this.villaId = villaId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }

    public Long getVillaId() {
        return villaId;
    }

    public void setVillaId(Long villaId) {
        this.villaId = villaId;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }
}
