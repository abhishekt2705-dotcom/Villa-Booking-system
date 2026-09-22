package com.villabook.dto;

import com.villabook.entity.Booking;
import com.villabook.entity.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private Long villaId;
    private String villaName;
    private String villaLocation;
    private String villaImageUrl;
    private BigDecimal pricePerNight;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private long nights;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime createdAt;

    public BookingResponse() {
    }

    public static BookingResponse fromEntity(Booking booking) {
        if (booking == null) return null;
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        if (booking.getUser() != null) {
            response.setUserId(booking.getUser().getId());
            response.setCustomerName(booking.getUser().getName());
            response.setCustomerEmail(booking.getUser().getEmail());
        }
        if (booking.getVilla() != null) {
            response.setVillaId(booking.getVilla().getId());
            response.setVillaName(booking.getVilla().getName());
            response.setVillaLocation(booking.getVilla().getLocation());
            response.setVillaImageUrl(booking.getVilla().getImageUrl());
            response.setPricePerNight(booking.getVilla().getPricePerNight());
        }
        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        if (booking.getCheckIn() != null && booking.getCheckOut() != null) {
            response.setNights(java.time.temporal.ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut()));
        }
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Long getVillaId() {
        return villaId;
    }

    public void setVillaId(Long villaId) {
        this.villaId = villaId;
    }

    public String getVillaName() {
        return villaName;
    }

    public void setVillaName(String villaName) {
        this.villaName = villaName;
    }

    public String getVillaLocation() {
        return villaLocation;
    }

    public void setVillaLocation(String villaLocation) {
        this.villaLocation = villaLocation;
    }

    public String getVillaImageUrl() {
        return villaImageUrl;
    }

    public void setVillaImageUrl(String villaImageUrl) {
        this.villaImageUrl = villaImageUrl;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
