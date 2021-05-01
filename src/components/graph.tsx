import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import "./graph.css";

// https://observablehq.com/@d3/connected-scatterplot

const Graph = (props: { width: number, height: number, choosePoint: Function }) => {
    // Graph attributes
    const { width, height } = props;
    const domainMultiplier = 150;
    const margin = 30;
    const opacity = 0.1;
    const graphTransitionDuration = 5000;
    const plotTransitionDuration = 500;
    const basePointSize = 2;
    const pointModifier = 3;
    let chosenPoints: any[] = [];

    const generateTestData = (a?: number, b?: number): { x: number, y: number }[] => {
        // Elliptic Curve formula : y^2 = x^3 + ax + b
        // Test with a = 0, b = 1, over the range of
        // const constants = { a:0, b: 0 };
        const constantA = !!a ? a : -1;
        const constantB = !!b ? b : 1;
        const points: { x: number, y: number }[] = [];
        for (let x = -3; x <= 3; x += 0.003) {
            let pointX = parseFloat(x.toPrecision(10));
            let y = pointX ** 3 + (constantA * pointX) + constantB;
            y = y > 0 ? y ** .5 : -(Math.abs(y) ** .5);
            if (y > 0) {
                points.push({ x: +x.toFixed(3), y: +y.toFixed(3) });
                points.push({ x: +x.toFixed(3), y: -(+y.toFixed(3)) });
            }
        }
        return points;
    };

    const renderGraph = (animateAxis: boolean = false) => {
        let svg: any;
        if (!svgElement) {
            svg = d3.select(ref.current);
            setSvgElement(svg);
        } else {
            svg = svgElement;
            svg.selectAll("*").remove();
            setDataset(() => generateTestData(1, 1));
        }

        drawXAxis(svg, animateAxis);
        drawYAxis(svg, animateAxis);
        drawPlotArea(svg);
    };

    const drawPlotArea = (svg: any) => {
        svg.append("g")
            .attr("id", "plotArea")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 0);
    };

    const drawCircle = (svg: any, point: { x: number, y: number }, delay: number) => {
        svg.selectAll("#plotArea")
            .append("circle")
            .data([point])
            .join("circle")
            .on('mouseover', function(d: any, i: any) {
                // @ts-ignore
                d3.select(this)
                    .transition()
                    .duration(5)
                    .attr('r', basePointSize + pointModifier)
                    .attr('fill', '#f48024');
                // @ts-ignore
                d3.select(this)
                    .raise();
            })
            .on('mouseout', function(d: any, i: any) {
                if (chosenPoints.some(p => p.x === point.x && p.y === point.y)) {
                    return;
                }
                // @ts-ignore
                d3.select(this)
                    .transition()
                    .duration(5)
                    .attr('r', basePointSize)
                    .attr('fill', '#FFF')
            })
            .on('click', function(d: any, i: any) {
                props.choosePoint(i);
                if (!!chosenPoints[1]) {
                    d3.select(`[idx='${chosenPoints[0].x}'][idy='${chosenPoints[0].y}']`)
                        .transition()
                        .duration(5)
                        .attr('r', basePointSize)
                        .attr('fill', '#FFF');

                    chosenPoints = [chosenPoints[1], point];
                } else if (!!chosenPoints[0]) {
                    chosenPoints = [chosenPoints[0], point];
                } else {
                    chosenPoints = [point];
                }

                // @ts-ignore
                d3.select(this)
                    .transition()
                    .duration(5)
                    .attr('r', basePointSize + pointModifier)
                    .attr('fill', '#ff0101');
            })
            .attr("cx", (d: any) => x(d.x))
            .attr("cy", (d: any) => y(d.y))
            .attr("r", 0)
            .attr('idx', (d: any) => d.x)
            .attr('idy', (d: any) => d.y)
            .transition()
            .delay(delay)
            .duration(plotTransitionDuration)
            .attr("r", basePointSize);
    };

    const drawXAxis = (svg: any, animateAxis: boolean) => {
        svg.append("g")
            .attr("transform", `translate(0,${height / 2})`)
            .call(d3.axisBottom(x).ticks(width / 150))
            .call((g: any) => g.selectAll(".tick line").clone()
                .attr("y2", -height)
                .attr("stroke-opacity", opacity)
                .attr("stroke-dasharray", height + " " + height)
                .attr("stroke-dashoffset", animateAxis ? height : 0)
                .transition()
                .duration(graphTransitionDuration)
                .attr("stroke-dashoffset", 0)
            )
            .call((g: any) => g.selectAll(".tick line").clone()
                .attr("y2", height)
                .attr("stroke-opacity", opacity)
                .attr("stroke-dasharray", height + " " + height)
                .attr("stroke-dashoffset", animateAxis ? height : 0)
                .transition()
                .duration(graphTransitionDuration)
                .attr("stroke-dashoffset", 0)
            )
    };
    const x = d3.scaleLinear()
        .domain([-(width / domainMultiplier), width / domainMultiplier])
        .range([margin, width - margin]);
    const y = d3.scaleLinear()
        .domain([(height / domainMultiplier), -(height / domainMultiplier)])
        .range([margin, height - margin]);

    const drawYAxis = (svg: any, animateAxis: boolean) => {
        svg.append("g")
            .attr("transform", `translate(${width / 2}, 0)`)
            .call(d3.axisLeft(y).ticks(height / 150))
            .call((g: any) => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", opacity)
                .attr("stroke-dasharray", width + " " + width)
                .attr("stroke-dashoffset", animateAxis ? width : 0)
                .transition()
                .duration(graphTransitionDuration)
                .attr("stroke-dashoffset", 0)
            )
            .call((g: any) => g.selectAll(".tick line").clone()
                .attr("x2", -width)
                .attr("stroke-opacity", opacity)
                .attr("stroke-dasharray", width + " " + width)
                .attr("stroke-dashoffset", animateAxis ? width : 0)
                .transition()
                .duration(graphTransitionDuration)
                .attr("stroke-dashoffset", 0)
            )
    };

    // D3
    const ref = useRef(null);
    const [dataset, setDataset] = useState<{ x: number, y: number }[]>(() => generateTestData());
    const [svgElement, setSvgElement] = useState<any>();
    const [tooltipElement, setTooltipElement] = useState<any>();

    useEffect(() => {
        renderGraph(true);
    }, []);

    useEffect(() => {
        dataset.forEach((p, i) => drawCircle(d3.select(ref.current), p, i));
    }, [dataset]);

    return (
        <div>
            <svg className="container" width={width} height={height} ref={ref} />
            <div className="Control-Container">
                <button onClick={() => renderGraph(false)}>Render Graph</button>
            </div>
        </div>
    );
}

export default Graph;
