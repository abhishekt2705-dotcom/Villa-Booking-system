package com.villabook.dto;

import com.villabook.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
