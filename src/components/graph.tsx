import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// https://observablehq.com/@d3/connected-scatterplot

const Graph = (props: { width: number, height: number }) => {
    // Graph attributes
    const { width, height } = props;
    const domainMultiplier = 150;
    const margin = 30;
    const opacity = 0.1;
    const graphTransitionDuration = 5000;
    const plotTransitionDuration = 2500;

    const generateTestData = (a?: number, b?: number): { x: number, y: number }[] => {
        // Elliptic Curve formula : y^2 = x^3 + ax + b
        // Test with a = 0, b = 1, over the range of
        // const constants = { a:0, b: 0 };
        const constantA = !!a ? a : -2;
        const constantB = !!b ? b : -1;
        console.log(constantA);
        console.log(constantB);
        const points: { x: number, y: number }[] = [];
        for(let x = -3; x <= 3; x+=0.003) {
            let pointX = parseFloat(x.toPrecision(10));
            let y = pointX**3 + (constantA*pointX) + constantB;
            y = y > 0 ? y**.5 : -(Math.abs(y)**.5);
            if (y > 0){
                points.push({ x, y });
                points.push({ x, y: -y });
            }
        }
        return points;
    }

    const renderGraph = async (animateAxis: boolean = false) => {
        let svg: any;
        if (!svgElement) {
            svg = d3.select(ref.current);
            setSvgElement(svg);
            console.log("1234");
        } else {
            svg = svgElement;
            svg.selectAll("*").remove();
            console.log("asdf");
            setDataset(generateTestData(1, 1));
        }

        console.log(dataset);

        drawXAxis(svg, animateAxis);
        drawYAxis(svg, animateAxis);
        drawPlotArea(svg);
        dataset.forEach((p, i) => drawCircle(svg, p, i));
    }

    const addPoints = (svg: any, data: { x: number, y: number }[]) => {
        svg.append("g")
            .attr("id", "plotArea")
            .attr("width", width)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 0)
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d: any) => x(d.x))
            .attr("cy", (d: any) => y(d.y))
            .attr("r", 1);
    }

    const drawPlotArea = (svg: any) => {
        svg.append("g")
            .attr("id", "plotArea")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 0);
    }

    const drawCircle = (svg: any, point: {x: number, y: number}, delay: number) => {
        svg.selectAll("#plotArea")
            .append("circle")
            .data([point])
            .join("circle")
            .attr("cx", (d: any) => x(d.x))
            .attr("cy", (d: any) => y(d.y))
            .attr("r", 0)
            .transition()
            .delay(delay)
            .duration(plotTransitionDuration)
            .attr("r", 1.5);
    }

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
    }
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
    }

    // D3
    const ref = useRef(null);
    const [dataset, setDataset] = useState<{x: number, y: number}[]>(() => generateTestData());
    const [svgElement, setSvgElement] = useState<any>();

    useEffect(() => {
        renderGraph(true);
    }, []);

    return (
        <div>
            <svg className="container" width={width} height={height} ref={ref}/>
            <button onClick={() => renderGraph(false)}>Render Graph</button>
        </div>
    );
}

export default Graph;
