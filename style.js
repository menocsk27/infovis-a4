const _style = [
  {
    selector: "core",
    style: {
      "selection-box-color": "#AAD8FF",
      "selection-box-border-color": "#8BB0D0",
      "selection-box-opacity": "0.5",
    },
  },
  {
    selector: "node",
    style: {
      width: "mapData(mins, 0, 1000, 10, 100)",
      height: "mapData(mins, 0, 1000, 10, 100)",
      content: "data(name)",
      "font-size": "12px",
      "text-valign": "center",
      "text-halign": "center",
      "background-color": "#555",
      "text-outline-color": "#555",
      "text-outline-width": "2px",
      color: "#fff",
      "overlay-padding": "6px",
      "z-index": "10",
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#77828C",
      "text-outline-color": "#77828C",
    },
  },
  {
    selector: "edge",
    style: {
      "curve-style": "haystack", // bezier, taxi, ...
      "haystack-radius": "0.5",
      opacity: "0.4",
      "line-color": "#bbb",
      width: "mapData(weight, 0, 1, 1, 8)",
      "overlay-padding": "3px",
    },
  },
  {
    selector: "node.magic",
    style: {
      // your magic lens effects for nodes go here!
      // See https://js.cytoscape.org/#style for all options
      "background-color": "#f00",
      shape: "pentagon",
    },
  },
  {
    selector: "edge.magic",
    style: {
      // your magic lens effects for edges go here!
      // See https://js.cytoscape.org/#style for all options
      "haystack-radius": "0.8",
      "line-color": "red",
      opacity: "1",
    },
  },
  {
    selector: ".rectangle",
    style: {
      shape: "rectangle",
    },
  },
  {
    selector: ".hidden",
    style: {
      display: "none",
    },
  },
];

export default _style;
