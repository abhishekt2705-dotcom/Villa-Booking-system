package com.villabook.dto;

public class DashboardStatsDTO {

    private long totalVillas;
    private long totalCustomers;
    private long totalBookings;
    private long confirmedBookings;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalVillas, long totalCustomers, long totalBookings, long confirmedBookings) {
        this.totalVillas = totalVillas;
        this.totalCustomers = totalCustomers;
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
    }

    public long getTotalVillas() {
        return totalVillas;
    }

    public void setTotalVillas(long totalVillas) {
        this.totalVillas = totalVillas;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }
}
