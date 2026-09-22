package com.villabook.dto;

import com.villabook.entity.Villa;
import com.villabook.entity.VillaStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class VillaDTO {

    private Long id;

    @NotBlank(message = "Villa name is required")
    private String name;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.01", message = "Price per night must be greater than 0")
    private BigDecimal pricePerNight;

    @NotNull(message = "Maximum guests is required")
    @Min(value = 1, message = "Maximum guests must be at least 1")
    private Integer maxGuests;

    private String imageUrl;

    private VillaStatus status = VillaStatus.ACTIVE;

    public VillaDTO() {
    }

    public VillaDTO(Long id, String name, String description, String location, BigDecimal pricePerNight, Integer maxGuests, String imageUrl, VillaStatus status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.pricePerNight = pricePerNight;
        this.maxGuests = maxGuests;
        this.imageUrl = imageUrl;
        this.status = status;
    }

    public static VillaDTO fromEntity(Villa villa) {
        if (villa == null) return null;
        return new VillaDTO(
                villa.getId(),
                villa.getName(),
                villa.getDescription(),
                villa.getLocation(),
                villa.getPricePerNight(),
                villa.getMaxGuests(),
                villa.getImageUrl(),
                villa.getStatus()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Integer getMaxGuests() {
        return maxGuests;
    }

    public void setMaxGuests(Integer maxGuests) {
        this.maxGuests = maxGuests;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public VillaStatus getStatus() {
        return status;
    }

    public void setStatus(VillaStatus status) {
        this.status = status;
    }
}
