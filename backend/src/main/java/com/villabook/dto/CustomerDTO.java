package com.villabook.dto;

public class CustomerDTO {

    private Long id;
    private String name;
    private String email;
    private long bookingsCount;

    public CustomerDTO() {
    }

    public CustomerDTO(Long id, String name, String email, long bookingsCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bookingsCount = bookingsCount;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getBookingsCount() {
        return bookingsCount;
    }

    public void setBookingsCount(long bookingsCount) {
        this.bookingsCount = bookingsCount;
    }
}
