import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// https://observablehq.com/@d3/connected-scatterplot

const Graph = (props: { width: number, height: number }) => {
    const { width, height } = props;

    // D3
    const ref = useRef(null);

    // Graph attributes
    const domainMultiplier = 125;

    useEffect(() => {
        const dataset1 = generateTestData();
        console.log(dataset1);
        // const dataset2 = generateTestData(false);
        renderGraph([dataset1]);
        // renderGraph([dataset1, dataset2]);
    });

    const generateTestData = (): { x: number, y: number }[] => {
        // Elliptic Curve formula : y^2 = x^3 + ax + b
        // Test with a = 0, b = 1, over the range of
        // const constants = { a:0, b: 0 };
        const constants = { a:-2, b: 0 };
        // const constants = { a:-1, b: 1 };
        const points: { x: number, y: number }[] = [];
        for(let x = -3; x <= 3; x+=0.001) {
            let pointX = parseFloat(x.toPrecision(10));
            let y = pointX**3 + (constants.a*pointX) + constants.b;
            y = y > 0 ? y**.5 : -(Math.abs(y)**.5);
            if (y > 0){
                points.push({ x, y });
                points.push({ x, y: -y });
            }
        }
        return points;
    }

    const renderGraph = (datasets: {x: number, y: number}[][]) => {
        const svg = d3.select(ref.current);
        drawXAxis(svg);
        drawYAxis(svg);
        datasets.forEach(ds => {
            // addLine(svg, ds);
            addPoints(svg, ds);
        });
    }

    const addPoints = (svg: any, data: { x: number, y: number }[]) => {
        svg.append("g")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 0)
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 1);
    }

    const addLine = (svg: any, data: {x: number, y: number}[]) => {
        const l = length(line(data));
        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-dasharray", `0,${l}`)
            .attr("d", line)
            .transition()
            .duration(2500)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l},${l}`);
    }

    const drawXAxis = (svg: any) => {
        svg.append("g")
            .attr("transform", `translate(0,${height / 2})`)
            .call(d3.axisBottom(x).ticks(width / 150))
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", -height)
                .attr("stroke-opacity", 0.1))
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", height)
                .attr("stroke-opacity", 0.1))
    }

    const line = d3
        .line()
        .curve(d3.curveCatmullRom)
        .x(d => x(d.x))
        .y(d => y(d.y));
    const length = (path: any) => {
        // @ts-ignore
        return d3.create("svg:path").attr("d", path).node().getTotalLength();
    }
    const x = d3.scaleLinear().domain([-(width / domainMultiplier), width / domainMultiplier]).range([0, width])
    const y = d3.scaleLinear().domain([(height / domainMultiplier), -(height / domainMultiplier)]).range([0, height])

    const drawYAxis = (svg: any) => {
        svg.append("g")
            .attr("transform", `translate(${width / 2}, 0)`)
            .call(d3.axisLeft(y).ticks(height / 150))
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1))
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", -width)
                .attr("stroke-opacity", 0.1))
    }

    return (
        <svg className="container" width={width} height={height} ref={ref}/>
    );
}

export default Graph;
