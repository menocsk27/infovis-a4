// This is your playground!
// Add functionality to your html controls, play with cytoscape's events and make those magic lenses!

/* global fetch, cytoscape */
import _style from "./style.js";
import { default as d3Fisheye } from "./libs/d3-fisheye-2.1.2.js";
import { default as _ } from "./libs/underscore-1.13.6.js";

async function getData() {
  const _data = await (await fetch("data/data.json")).json();
  const football = await (await fetch("data/football.json")).json();
  const data = [];

  football.nodes.forEach((n) => {
    data.push({
      data: {
        id: n.id,
        name: n.label,
        mins: n.mins_played || 0,
        og: n.mins_played || 0,
        all: n,
      },
      group: "nodes",
    });
  });

  football.edges.forEach((n) => {
    data.push({
      data: {
        id: n.id,
        source: n.src,
        target: n.dst,
        weight: n.val,
      },
      group: "edges",
    });
  });

  return data;
}

// returns true if the point "p" is inside the circle defined by "c" (center) and "r" (radius)
function isInCircle(c, r, p) {
  return Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2) <= Math.pow(r, 2);
}

// returns the nodes that are visible
function nodesInView(cy) {
  const ext = cy.extent();

  return cy.nodes().filter((n) => {
    const bb = n.boundingBox();
    return bb.x1 > ext.x1 && bb.x2 < ext.x2 && bb.y1 > ext.y1 && bb.y2 < ext.y2;
  });
}

async function main() {
  const data = await getData();

  const cy = cytoscape({
    container: document.getElementById("cy"),
    elements: data,
    wheelSensitivity: 0.2,
  });

  const layout = cy.layout({
    name: "cola",
    nodeSpacing: 50,
    edgeLength: 800,
    animate: true,
    randomize: false,
    maxSimulationTime: 2000,
  });

  layout.run(); // emits special events!

  cy.style(_style);

  const divs = {};

  function starplotNode(n) {
    const id = "id" + n.data().id;
    let div;
    if (!divs[id]) {
      div = document.createElement("div");
      div.id = id;
      divs[id] = div;
    } else {
      div = divs[id];
    }

    const p = n.renderedPosition();
    const r = n.renderedWidth() / 2;

    div.style.position = "absolute";
    div.style.left = p.x - r + "px";
    div.style.top = p.y - r + "px";
    cy.container().appendChild(div);

    const node_data = n.data();

    /*
    const radarChartOptions = { w: r * 2, h: r * 2 };

    const d = [];
    Object.keys(node_data.all).forEach((k) => {
      if (
        node_data.all[k] &&
        typeof node_data.all[k] !== "string" &&
        k !== "mins_played"
      ) {
        d.push({ axis: k, value: node_data.all[k] });
      }
    });

    RadarChart("#" + id, [d], radarChartOptions);
    /**/

    const radarChartOptions = {
      w: r * 2,
      h: r * 2,
      _filter: (f) => {
        return typeof node_data.all[f] !== "string" && f !== "mins_played";
      },
    };
    RadarChart2("#" + id, [node_data.all], radarChartOptions);
    /**/
  }

  const t1 = 0.3,
    t2 = 0.6,
    lvl0 = 10;

  const semanticToggle = document.getElementById("semantic-or-lens");

  const nodes = cy
    .nodes()
    .filter((n) => Object.keys(n.data().all).length < lvl0);

  cy.on("zoom, pan", (e) => {
    const zoom_level = cy.zoom();
    //console.log(`Zoom level: ${zoom_level}`);

    /* 
      Your code goes here! 

      HINTs: 
        1. cy.zoom() returns the current zoom level. Notice how it changes while the layout is simulated! 
        2. This line above `cy.style(_style)`, loads the stylesheet from style.js, which you may also edit for the magic lenses later. You can load other stylesheets! 
        3. Use `nodesInView` to get a selection of only the nodes within the viewport
        4. For the radar charts, use the RadarChart function from /libs. See how it is used in: https://gist.github.com/nbremer/21746a9668ffdf6d8242 
    */

    Object.keys(divs).forEach((k) => {
      divs[k].remove();
    });

    if (semanticToggle.checked) {
      if (zoom_level < t1) {
        console.log("level 0");
        nodes.addClass("hidden");
      } else if (zoom_level >= t1 && zoom_level < t2) {
        console.log("level 1");

        nodes.removeClass("hidden");
        nodes.addClass("rectangle");
      } else {
        console.log("level 2");

        const n_in_view = nodesInView(cy);

        n_in_view.forEach((n) => {
          starplotNode(n);
        });
      }
    }
  });

  // get the initial lens radius
  const lens = document.getElementById("lens");
  const initialLensRadius = lens.getAttribute("r");

  // set the initial value of the lens radius range slider and displayed value
  const radiusRange = document.getElementById("radiusRange");
  radiusRange.setAttribute("value", initialLensRadius);

  // adjust radius range slider, displayed value and lens radius when range slider value changes
  radiusRange.onchange = (event) => {
    radiusRange.setAttribute("value", event.target.value);
    //radiusRange.previousElementSibling.value = event.target.value;
    lens.setAttribute("r", event.target.value);
  };

  // switch between the two lens functionalities via html select
  const modeSelect = document.getElementById("modeSelect");

  const fisheye = d3Fisheye().radius(200).distortion(2).smoothing(0.5);
  
  cy.on(
    "mousemove",
    _.throttle((e) => {
      const mouse = { x: e.originalEvent.x, y: e.originalEvent.y };
      //console.log(`Mouse position: [x: ${mouse.x}, y: ${mouse.y}]`);

     
      
      const edges = [];

      cy.edges().forEach((e) => {
        e.removeClass("magic");
      });

      // get the lens and relevant attributes
      const lens = document.getElementById("lens");
      const lensCenter = {
        x: lens.getAttribute("cx"),
        y: lens.getAttribute("cy"),
      };
      const lensRadius = lens.getAttribute("r");
      //const lensSelected = isInCircle(lensCenter, lensRadius, mouse);

      // set lens position to mouse position
      lens.setAttribute("cx", mouse.x);
      lens.setAttribute("cy", mouse.y);

      fisheye.focus([mouse.x, mouse.y]);
      
      
      if (!semanticToggle.checked) {
         Object.keys(divs).forEach((k) => {
          divs[k].remove();
        });
        cy.nodes().forEach((n) => {
          const node = n.renderedPosition(); // Careful: other position functions may invoke different coordinate systems

          const connectedEdges = n.connectedEdges(); // get edges connected to node

          if (modeSelect.value === "fish") {
            if (!n.data().ox || !n.data().oy) {
              n.data({
                ox: node.x,
                oy: node.y,
              });
            }

            const d = n.data();
            const f = fisheye([d.ox, d.oy]);

            n.renderedPosition({ x: f[0], y: f[1] });
            n.data({
              mins: n.data("og") * f[2],
            });
          }
          
          if (isInCircle(lensCenter, lensRadius, node)) {
            if (modeSelect.value === "node") {
              n.addClass("magic");
            } else if (modeSelect.value === "edge") {
              edges.push(connectedEdges);
            }
          }

          if (!isInCircle(lensCenter, lensRadius, node)) {
            // remove magic if node is not within lens
            if (modeSelect.value === "node") {
              n.removeClass("magic");
            }
          }

          // console.log(`Node position: [x: ${node.x}, y: ${node.y}]`);
        });
      }
      
      edges.forEach((e) => {
        e.addClass("magic");
      });

      /* 
      Your code also goes here! 

      HINTs: 
        1. use the "isInCircle" function defined above to calculate whether a node is inside the lens! 
        2. if you experience performance issues, use cy.startBatch() and cy.endBatch() to avoid unnecessary canvas redraws. See https://js.cytoscape.org/#cy.batch for more
        3. see below how to get the mouse and node positions
    */
    }, 100)
  );
}

main();
