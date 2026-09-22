package com.villabook.config;

import com.villabook.entity.*;
import com.villabook.repository.UserRepository;
import com.villabook.repository.VillaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final VillaRepository villaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           VillaRepository villaRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.villaRepository = villaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Initializing admin account and villas...");

            // 1. Seed Admin User
            User admin = new User(
                    "System Admin",
                    "admin@villabook.com",
                    passwordEncoder.encode("admin123"),
                    Role.ADMIN
            );
            userRepository.save(admin);

            // 2. Seed Villas
            Villa villa1 = new Villa(
                    "Villa Paradise",
                    "A breathtaking beachfront villa overlooking the Arabian Sea with a private pool, lush tropical garden, and sunset terrace.",
                    "Goa",
                    new BigDecimal("5000.00"),
                    4,
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                    VillaStatus.ACTIVE
            );
            villaRepository.save(villa1);

            Villa villa2 = new Villa(
                    "Ocean Breeze Villa",
                    "Modern coastal villa just walking distance from the beach. Features 3 spacious bedrooms, infinity pool, and open-air gazebo.",
                    "Alibaug",
                    new BigDecimal("7500.00"),
                    6,
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                    VillaStatus.ACTIVE
            );
            villaRepository.save(villa2);

            Villa villa3 = new Villa(
                    "Mountain Retreat Villa",
                    "Serene wooden chalet nestled in the pine hills with panoramic snow-capped Himalayan mountain views and a cozy fireplace.",
                    "Manali",
                    new BigDecimal("4200.00"),
                    4,
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
                    VillaStatus.ACTIVE
            );
            villaRepository.save(villa3);

            Villa villa4 = new Villa(
                    "Royal Palms Luxury Villa",
                    "Opulent heritage-inspired villa with private courtyard, grand royal suites, indoor heated plunge pool, and lush manicured lawns.",
                    "Udaipur",
                    new BigDecimal("12000.00"),
                    8,
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                    VillaStatus.ACTIVE
            );
            villaRepository.save(villa4);

            logger.info("Initial data initialized successfully: 1 Admin, 4 Villas.");
        }
    }
}
