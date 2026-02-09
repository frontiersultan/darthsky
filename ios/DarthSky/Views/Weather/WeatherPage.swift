import SwiftUI

struct WeatherPage: View {
    @Environment(WeatherViewModel.self) private var weatherVM
    @Environment(LocationViewModel.self) private var locationVM
    @Environment(SettingsViewModel.self) private var settings
    @State private var showLocationSearch = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Background gradient
                backgroundGradient
                    .ignoresSafeArea()

                // Content
                if weatherVM.isLoading && weatherVM.weatherData == nil {
                    loadingView
                } else if let error = weatherVM.error, weatherVM.weatherData == nil {
                    WeatherErrorView(message: error) {
                        if let location = locationVM.activeLocation {
                            Task { await weatherVM.refresh(for: location) }
                        }
                    }
                } else if let data = weatherVM.weatherData {
                    weatherContent(data)
                } else {
                    emptyStateView
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    locationButton
                }
                ToolbarItem(placement: .topBarTrailing) {
                    refreshButton
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
        }
        .sheet(isPresented: $showLocationSearch) {
            LocationSearchView()
        }
        .task(id: locationVM.activeLocationId) {
            if let location = locationVM.activeLocation {
                await weatherVM.fetchWeather(for: location)
                weatherVM.startAutoRefresh(for: location)
            }
        }
        .onDisappear {
            weatherVM.stopAutoRefresh()
        }
    }

    // MARK: - Background

    private var backgroundGradient: some View {
        Group {
            if let data = weatherVM.weatherData {
                WeatherColors.backgroundGradient(
                    isDay: data.current.isDay,
                    weatherCode: data.current.weatherCode
                )
            } else {
                LinearGradient(
                    colors: [
                        Color(red: 0.15, green: 0.35, blue: 0.65),
                        Color(red: 0.3, green: 0.55, blue: 0.85)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            }
        }
    }

    // MARK: - Toolbar

    private var locationButton: some View {
        Button {
            showLocationSearch = true
        } label: {
            HStack(spacing: 4) {
                if locationVM.activeLocation?.isCurrentLocation == true {
                    Image(systemName: "location.fill")
                        .font(.caption)
                }
                Text(locationVM.activeLocation?.name ?? "Select Location")
                    .font(.headline)
                Image(systemName: "chevron.down")
                    .font(.caption2)
            }
            .foregroundStyle(.white)
        }
    }

    private var refreshButton: some View {
        Button {
            if let location = locationVM.activeLocation {
                Task { await weatherVM.refresh(for: location) }
            }
        } label: {
            if weatherVM.isLoading {
                ProgressView()
                    .tint(.white)
            } else {
                Image(systemName: "arrow.clockwise")
                    .foregroundStyle(.white)
            }
        }
        .disabled(weatherVM.isLoading)
    }

    // MARK: - Content States

    private var loadingView: some View {
        VStack(spacing: 16) {
            SkeletonView(height: 250)
            SkeletonView(height: 120)
            SkeletonView(height: 300)
        }
        .padding()
    }

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "cloud.sun.fill")
                .font(.system(size: 64))
                .foregroundStyle(.white.opacity(0.6))

            Text("Add a location to get started")
                .font(.title3)
                .foregroundStyle(.white.opacity(0.8))

            Button {
                showLocationSearch = true
            } label: {
                Label("Add Location", systemImage: "plus")
                    .font(.body.weight(.medium))
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(.white.opacity(0.2))
                    .foregroundStyle(.white)
                    .clipShape(Capsule())
            }
        }
    }

    // MARK: - Weather Content

    private func weatherContent(_ data: WeatherData) -> some View {
        ScrollView {
            VStack(spacing: 16) {
                // Alerts
                AlertsBannerView(alerts: data.alerts)

                // Current conditions
                CurrentConditionsView(
                    conditions: data.current,
                    precipSummary: weatherVM.precipitationSummary
                )

                // Hourly forecast
                HourlyForecastView(forecasts: data.hourly)

                // Daily forecast
                DailyForecastView(forecasts: data.daily)

                // Precipitation chart
                PrecipitationGraphView(hourly: data.hourly)

                // Details grid
                DetailsGridView(conditions: data.current)

                // Last updated
                LastUpdatedView(date: data.lastUpdated)
                    .padding(.top, 8)
                    .padding(.bottom, 20)
            }
            .padding(.horizontal)
            .padding(.top, 8)
        }
        .refreshable {
            if let location = locationVM.activeLocation {
                await weatherVM.refresh(for: location)
            }
        }
    }
}
