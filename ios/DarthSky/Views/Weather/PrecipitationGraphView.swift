import SwiftUI
import Charts

struct PrecipitationGraphView: View {
    let hourly: [HourlyForecast]
    @Environment(SettingsViewModel.self) private var settings

    private var data: [PrecipChartPoint] {
        Array(hourly.prefix(24)).enumerated().map { index, hour in
            PrecipChartPoint(
                index: index,
                time: hour.time,
                probability: hour.precipitationProbability,
                amount: hour.precipitation
            )
        }
    }

    private var hasAnyPrecip: Bool {
        data.contains(where: { $0.probability > 0 || $0.amount > 0 })
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "Precipitation", icon: "cloud.rain")
                .padding(.horizontal, 4)

            if hasAnyPrecip {
                precipChart
            } else {
                noPrecipView
            }
        }
    }

    private var precipChart: some View {
        VStack(alignment: .leading, spacing: 8) {
            Chart(data) { point in
                // Precipitation amount as bars
                BarMark(
                    x: .value("Hour", point.time, unit: .hour),
                    y: .value("Amount", settings.convertPrecip(point.amount))
                )
                .foregroundStyle(.blue.opacity(0.5))

                // Probability as line
                LineMark(
                    x: .value("Hour", point.time, unit: .hour),
                    y: .value("Probability", point.probability / 100.0 * maxPrecipAmount)
                )
                .foregroundStyle(.cyan)
                .lineStyle(StrokeStyle(lineWidth: 2))

                AreaMark(
                    x: .value("Hour", point.time, unit: .hour),
                    y: .value("Probability", point.probability / 100.0 * maxPrecipAmount)
                )
                .foregroundStyle(.cyan.opacity(0.15))
            }
            .chartYAxisLabel(settings.units.precipitation.label)
            .chartXAxis {
                AxisMarks(values: .stride(by: .hour, count: 4)) { value in
                    AxisValueLabel {
                        if let date = value.as(Date.self) {
                            Text(settings.formatHour(date))
                                .font(.caption2)
                        }
                    }
                    AxisGridLine()
                }
            }
            .chartYAxis {
                AxisMarks(position: .leading) { value in
                    AxisValueLabel {
                        if let v = value.as(Double.self) {
                            Text(String(format: "%.1f", v))
                                .font(.caption2)
                        }
                    }
                    AxisGridLine()
                }
            }
            .frame(height: 160)
        }
        .weatherCard()
    }

    private var noPrecipView: some View {
        HStack {
            Image(systemName: "cloud.sun.fill")
                .foregroundStyle(.yellow)
            Text("No precipitation expected in the next 24 hours")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .weatherCard()
    }

    private var maxPrecipAmount: Double {
        max(data.map(\.amount).max() ?? 1, 0.5)
    }
}

private struct PrecipChartPoint: Identifiable {
    let index: Int
    let time: Date
    let probability: Double
    let amount: Double

    var id: Int { index }
}
