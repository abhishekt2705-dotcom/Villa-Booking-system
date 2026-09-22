package com.villabook.service;

import com.villabook.dto.CustomerDTO;
import com.villabook.dto.DashboardStatsDTO;
import com.villabook.dto.BookingResponse;
import com.villabook.dto.VillaDTO;
import com.villabook.entity.*;
import com.villabook.exception.ResourceNotFoundException;
import com.villabook.repository.BookingRepository;
import com.villabook.repository.UserRepository;
import com.villabook.repository.VillaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final VillaRepository villaRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public AdminService(VillaRepository villaRepository,
                        BookingRepository bookingRepository,
                        UserRepository userRepository) {
        this.villaRepository = villaRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long totalVillas = villaRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);

        return new DashboardStatsDTO(totalVillas, totalCustomers, totalBookings, confirmedBookings);
    }

    @Transactional(readOnly = true)
    public List<VillaDTO> getAllVillas() {
        return villaRepository.findAllByOrderByIdDesc()
                .stream()
                .map(VillaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public VillaDTO addVilla(VillaDTO dto) {
        Villa villa = new Villa();
        villa.setName(dto.getName().trim());
        villa.setDescription(dto.getDescription());
        villa.setLocation(dto.getLocation().trim());
        villa.setPricePerNight(dto.getPricePerNight());
        villa.setMaxGuests(dto.getMaxGuests());
        villa.setImageUrl(dto.getImageUrl());
        villa.setStatus(dto.getStatus() != null ? dto.getStatus() : VillaStatus.ACTIVE);

        Villa saved = villaRepository.save(villa);
        return VillaDTO.fromEntity(saved);
    }

    @Transactional
    public VillaDTO updateVilla(Long id, VillaDTO dto) {
        Villa villa = villaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Villa not found with id: " + id));

        villa.setName(dto.getName().trim());
        villa.setDescription(dto.getDescription());
        villa.setLocation(dto.getLocation().trim());
        villa.setPricePerNight(dto.getPricePerNight());
        villa.setMaxGuests(dto.getMaxGuests());
        villa.setImageUrl(dto.getImageUrl());
        if (dto.getStatus() != null) {
            villa.setStatus(dto.getStatus());
        }

        Villa updated = villaRepository.save(villa);
        return VillaDTO.fromEntity(updated);
    }

    @Transactional
    public void deleteVilla(Long id) {
        Villa villa = villaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Villa not found with id: " + id));
        villaRepository.delete(villa);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        return BookingResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        List<User> customers = userRepository.findByRole(Role.CUSTOMER);
        return customers.stream().map(cust -> {
            long bookingsCount = bookingRepository.countByUserId(cust.getId());
            return new CustomerDTO(cust.getId(), cust.getName(), cust.getEmail(), bookingsCount);
        }).collect(Collectors.toList());
    }
}
