package com.villabook.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "villas")
public class Villa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(name = "max_guests", nullable = false)
    private Integer maxGuests;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VillaStatus status = VillaStatus.ACTIVE;

    @OneToMany(mappedBy = "villa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    public Villa() {
    }

    public Villa(Long id, String name, String description, String location, BigDecimal pricePerNight, Integer maxGuests, String imageUrl, VillaStatus status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.pricePerNight = pricePerNight;
        this.maxGuests = maxGuests;
        this.imageUrl = imageUrl;
        this.status = status != null ? status : VillaStatus.ACTIVE;
    }

    public Villa(String name, String description, String location, BigDecimal pricePerNight, Integer maxGuests, String imageUrl, VillaStatus status) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.pricePerNight = pricePerNight;
        this.maxGuests = maxGuests;
        this.imageUrl = imageUrl;
        this.status = status != null ? status : VillaStatus.ACTIVE;
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

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
