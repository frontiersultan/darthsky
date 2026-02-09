import SwiftUI

struct LocationSearchView: View {
    @Environment(LocationViewModel.self) private var locationVM
    @Environment(\.dismiss) private var dismiss
    @State private var searchText = ""

    var body: some View {
        NavigationStack {
            List {
                // Current location button
                Section {
                    Button {
                        locationVM.requestCurrentLocation()
                        dismiss()
                    } label: {
                        Label("Use Current Location", systemImage: "location.fill")
                            .foregroundStyle(.cyan)
                    }

                    if locationVM.locationPermissionDenied {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundStyle(.orange)
                                .font(.caption)
                            Text("Location access denied. Enable in Settings.")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                // Saved locations
                if !locationVM.locations.isEmpty {
                    Section("Saved Locations") {
                        ForEach(locationVM.locations) { location in
                            Button {
                                locationVM.setActiveLocation(location)
                                dismiss()
                            } label: {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        HStack(spacing: 4) {
                                            if location.isCurrentLocation {
                                                Image(systemName: "location.fill")
                                                    .font(.caption2)
                                                    .foregroundStyle(.cyan)
                                            }
                                            Text(location.name)
                                                .font(.body)
                                                .foregroundStyle(.primary)
                                        }
                                        Text(location.displayName)
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }

                                    Spacer()

                                    if location.id == locationVM.activeLocationId {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundStyle(.cyan)
                                    }
                                }
                            }
                        }
                        .onDelete { indexSet in
                            for index in indexSet {
                                locationVM.removeLocation(locationVM.locations[index])
                            }
                        }
                        .onMove { from, to in
                            locationVM.moveLocation(from: from, to: to)
                        }
                    }
                }

                // Search results
                if !searchText.isEmpty {
                    Section("Search Results") {
                        if locationVM.isSearching {
                            HStack {
                                ProgressView()
                                    .scaleEffect(0.8)
                                Text("Searching...")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                        } else if let error = locationVM.searchError {
                            HStack {
                                Image(systemName: "exclamationmark.circle")
                                    .foregroundStyle(.red)
                                Text(error)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        } else if locationVM.searchResults.isEmpty && !searchText.isEmpty {
                            Text("No locations found")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        } else {
                            ForEach(locationVM.searchResults) { result in
                                Button {
                                    locationVM.addLocation(result)
                                    dismiss()
                                } label: {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(result.name)
                                            .font(.body)
                                            .foregroundStyle(.primary)
                                        Text(result.displayName)
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Locations")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Search for a city...")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    EditButton()
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .onChange(of: searchText) { _, newValue in
                locationVM.search(query: newValue)
            }
            .onDisappear {
                locationVM.clearSearch()
            }
        }
    }
}
