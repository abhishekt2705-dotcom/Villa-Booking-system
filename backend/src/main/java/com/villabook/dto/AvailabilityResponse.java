package com.villabook.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AvailabilityResponse {

    private boolean available;
    private String message;
    private Long villaId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private long nights;
    private BigDecimal pricePerNight;
    private BigDecimal totalAmount;

    public AvailabilityResponse() {
    }

    public AvailabilityResponse(boolean available, String message, Long villaId, LocalDate checkIn, LocalDate checkOut, long nights, BigDecimal pricePerNight, BigDecimal totalAmount) {
        this.available = available;
        this.message = message;
        this.villaId = villaId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.nights = nights;
        this.pricePerNight = pricePerNight;
        this.totalAmount = totalAmount;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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

    public long getNights() {
        return nights;
    }

    public void setNights(long nights) {
        this.nights = nights;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
