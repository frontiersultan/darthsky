import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { Card } from '../common';
import { useSettingsStore } from '../../stores';
import type { HourlyForecast, PrecipitationMinute } from '../../types';

interface PrecipitationGraphProps {
  hourly: HourlyForecast[];
  minutely?: PrecipitationMinute[];
  summary?: string | null;
}

export function PrecipitationGraph({
  hourly,
  minutely,
  summary,
}: PrecipitationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);

  const data = useMemo(() => {
    if (minutely && minutely.length > 0) {
      return minutely.map((m) => ({
        time: m.time,
        intensity: m.intensity,
        probability: m.probability,
      }));
    }

    return hourly.slice(0, 12).map((h) => ({
      time: h.time,
      intensity: h.precipitation,
      probability: h.precipitationProbability,
    }));
  }, [hourly, minutely]);

  const maxIntensity = Math.max(...data.map((d) => d.intensity), 0.1);
  const hasPrecipitation = data.some((d) => d.intensity > 0 || d.probability > 20);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 10 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 120 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'precipGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgb(59, 130, 246)')
      .attr('stop-opacity', 0.7);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgb(59, 130, 246)')
      .attr('stop-opacity', 0.1);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.time) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear().domain([0, maxIntensity]).range([height, 0]);

    const area = d3
      .area<(typeof data)[0]>()
      .x((d) => x(d.time))
      .y0(height)
      .y1((d) => y(d.intensity))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<(typeof data)[0]>()
      .x((d) => x(d.time))
      .y((d) => y(d.intensity))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('fill', 'url(#precipGradient)')
      .attr('d', area);

    g.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'rgb(59, 130, 246)')
      .attr('stroke-width', 2)
      .attr('d', line);

    const xAxis = d3
      .axisBottom(x)
      .ticks(6)
      .tickFormat((d) => {
        const date = d as Date;
        const hours = date.getHours();
        return hours === 0 ? '12AM' : hours < 12 ? `${hours}AM` : hours === 12 ? '12PM' : `${hours - 12}PM`;
      });

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('class', 'text-xs fill-slate-400');

    if (hasPrecipitation) {
      const intensityLabels = [
        { value: maxIntensity * 0.33, label: 'Light' },
        { value: maxIntensity * 0.66, label: 'Medium' },
        { value: maxIntensity, label: 'Heavy' },
      ];

      g.selectAll('.intensity-label')
        .data(intensityLabels)
        .enter()
        .append('text')
        .attr('class', 'text-xs fill-slate-400')
        .attr('x', width - 5)
        .attr('y', (d) => y(d.value) + 4)
        .attr('text-anchor', 'end')
        .attr('opacity', 0.5)
        .text((d) => d.label);
    }

    if (!reducedMotion && hasPrecipitation) {
      data.forEach((d) => {
        if (d.probability > 50 && d.intensity > 0) {
          const wobbleAmount = (d.probability / 100) * 3;

          g.append('circle')
            .attr('cx', x(d.time))
            .attr('cy', y(d.intensity))
            .attr('r', 3)
            .attr('fill', 'rgb(59, 130, 246)')
            .style('--wobble-amount', `${wobbleAmount}px`)
            .attr('class', 'precip-uncertain');
        }
      });
    }
  }, [data, maxIntensity, hasPrecipitation, reducedMotion]);

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Precipitation
        </h2>
        {summary && (
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            {summary}
          </p>
        )}
      </div>

      <div className="p-4">
        {hasPrecipitation ? (
          <svg
            ref={svgRef}
            className="w-full"
            style={{ height: 120 }}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <div className="flex items-center justify-center h-20 text-slate-500 dark:text-slate-400">
            No precipitation expected
          </div>
        )}
      </div>
    </Card>
  );
}
