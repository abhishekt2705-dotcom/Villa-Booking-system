package com.villabook.controller;

import com.villabook.dto.CustomerDTO;
import com.villabook.dto.DashboardStatsDTO;
import com.villabook.dto.BookingResponse;
import com.villabook.dto.StatusUpdateRequest;
import com.villabook.dto.VillaDTO;
import com.villabook.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/villas")
    public ResponseEntity<List<VillaDTO>> getAllVillas() {
        return ResponseEntity.ok(adminService.getAllVillas());
    }

    @PostMapping("/villas")
    public ResponseEntity<VillaDTO> addVilla(@Valid @RequestBody VillaDTO villaDTO) {
        VillaDTO created = adminService.addVilla(villaDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/villas/{id}")
    public ResponseEntity<VillaDTO> updateVilla(@PathVariable Long id, @Valid @RequestBody VillaDTO villaDTO) {
        VillaDTO updated = adminService.updateVilla(id, villaDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/villas/{id}")
    public ResponseEntity<Void> deleteVilla(@PathVariable Long id) {
        adminService.deleteVilla(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        BookingResponse updated = adminService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }
}
