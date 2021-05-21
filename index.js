/*-------------------------------init-------------------------------*/

const chartUrl = {
    movie: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    game: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    kickStarter: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
}

const description = {
    movie: "Top movies sale per category",
    game: "Top video game sale per platform",
    kickStarter: "Top kickstarter pledge"
}

const margin = {
    top: 100,
    right: 50,
    bottom: 100,
    left: 50
}

const size = {
    width: 900,
    height: 600
}

const textWrap = (text) => {
    x = text.split(" ");
    result = x.join(" <br> ")
    return result
}


//create svg

const svg = d3.select(".chart__container").append("svg");

svg.attr("width", size.width).attr("height", size.height).attr("class", "chart__container__svg")


/*-------------------------------Graph-------------------------------*/

const callChart = async(url, type) => {
    const fetchChart = await fetch(url);
    const data = await fetchChart.json();
    //change title and description

    const title = d3.select(".currentTitle").text(`${data.name}`)
    const description = d3.select(".currentDescription").text(`${type}`)

    //Create chart
    const rootTree = d3.hierarchy(data).sum((e) => e.value).sort((a, b) => b.value - a.value);


    const colorScale = d3.scaleSequential().domain([1, rootTree.data.children.length]).interpolator(d3.interpolateRainbow);
    for (let i = 0; i < rootTree.data.children.length; i++) {
        rootTree.data.children[i].color = colorScale(i);
    }

    const tree = d3.treemap().size([size.width, size.height - margin.bottom]).padding(1);
    tree(rootTree);


    const chartTree = svg.append("g")
        .selectAll(".tile")
        .data(rootTree.leaves())
        .enter()
        .append('g')
    chartTree
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("data-color", d => d.parent.data.color)
        .attr("fill", d => d.parent.data.color)
        .style("font-size", "10px")
    chartTree.append("text")
        .text(d => d.data.name)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("data-color", d => d.parent.data.color)
        .attr("x", d => d.x0 + 5)
        .attr("y", d => d.y0 + 10)
        .style("font-size", "10px")


    /*-------------------------------Legend-------------------------------*/

    //create an array with all category name
    const category = d3.hierarchy(data).data.children.map(e => e);
    const categoryArr = tree(rootTree).children.map(e => {
        return { color: e.data.color, name: e.data.name, size: 1 };
    })

    const xScale = d3.scaleBand().domain(categoryArr.map(e => e.size)).range([margin.left, size.width - margin.right]).padding(0.1)

    const legend = svg.append("g").attr("id", "legend");

    const legendGroup = legend.selectAll(".legend__g")
        .data(categoryArr)
        .enter()
        .append("g")

    legendGroup.append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", 20)
        .attr("y", size.height - (margin.bottom / 2))
        .attr("x", (d, i) => {
            return xScale(d.size)
        })
        .attr("fill", (d, i) => d.color)

    //console.log("color: " + colorScale(i - 1) + "cat: " + d

    xNumber = 0;
    yNumber = 4;

    legendGroup.append("text")
        .attr("x", d => xScale(d.size) + xScale.bandwidth() / 2)
        .attr("y", (size.height - (margin.bottom / 2)) + 13)
        .text(d => d.name)
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .style("fill", "white")



    //Create tooltip

    const tooltip = d3.select(".chart__container").append("div");

    tooltip.attr("id", "tooltip")
        .style("opacity", "0")
        .style("position", "absolute")
        .style("background-color", "gold")
        .style("padding", "10px")
        .style("border-radius", "5px")

    //Create hover effect

    chartTree.on("mousemove", (e) => {
        const element = e.target.dataset;
        let tooltipWidth = parseInt(tooltip.style("width"), 10) / 2;
        tooltip.style("opacity", "1")
            .html(`Name: ${element.name}<br> Category: ${element.category}<br> Value:${element.value} <br> Color: ${element.color}`)
            .style("left", e.offsetX - tooltipWidth + "px")
            .style("top", e.offsetY + 30 + "px")
    })

    chartTree.on("mouseout", (e) => {
        tooltip.style("opacity", "0")
    })

}

callChart(chartUrl.kickStarter, description.game);