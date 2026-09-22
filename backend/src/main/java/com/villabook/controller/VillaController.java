package com.villabook.controller;

import com.villabook.dto.AvailabilityResponse;
import com.villabook.dto.VillaDTO;
import com.villabook.service.VillaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/villas")
public class VillaController {

    private final VillaService villaService;

    public VillaController(VillaService villaService) {
        this.villaService = villaService;
    }

    @GetMapping
    public ResponseEntity<List<VillaDTO>> getAllActiveVillas() {
        return ResponseEntity.ok(villaService.getActiveVillas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VillaDTO> getVillaById(@PathVariable Long id) {
        return ResponseEntity.ok(villaService.getVillaById(id));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<AvailabilityResponse> checkAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ResponseEntity.ok(villaService.checkAvailability(id, checkIn, checkOut));
    }
}
