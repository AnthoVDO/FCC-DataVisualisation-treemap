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
    height: 500
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
    const rootTree = d3.hierarchy(data).sum((e) => e.value)
    const tree = d3.treemap().size([size.width, size.height]).padding(1);
    tree(rootTree);

    const colorScale = d3.scaleSequential().domain([1, rootTree.data.children.length]).interpolator(d3.interpolateRainbow);
    for (let i = 0; i < rootTree.data.children.length; i++) {
        rootTree.data.children[i].color = colorScale(i);
    }

    const chartTree = svg.append("g");
    chartTree.selectAll(".tile")
        .data(rootTree.leaves())
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("fill", d => d.parent.data.color)
        .text(d => d.data.name)
        .style("font-size", "10px")

    //Create legend

    //Create tooltip

    //Create hover effect

}

callChart(chartUrl.kickStarter, description.movie);