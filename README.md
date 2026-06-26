# InfoVis Assignment 4

Based on the files and code from https://js.cytoscape.org/demos/colajs-graph/

## Development

The files that you will probably need to edit are: 

`index.html`: When adding controls for your lenses, you may need to add some html elements here 
(selects, sliders, toggles, etc.)

`style.js`: Cytoscape uses this format to change the look of the node-link-diagram. 
It may be useful to create a new class for nodes and edges that you want to modify when under the effect of the lens. 
See https://js.cytoscape.org/#style for all the options. 

`script.js`: This is where you do your magic (no pun intended). 
Cytoscape and the events are already called there. 
You focus on simulating the lens behavior and adding functionality to your html controls.

## Local development:
Pre-requisite: Node.js. Install serve using:

`npm install serve --global`

And start the application using

`serve -p 8000`