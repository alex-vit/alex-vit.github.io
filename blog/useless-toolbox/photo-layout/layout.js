var BASE = 100;
var LANDSCAPE = 1;
var PORTRAIT = 0.5;

function randomColor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    
    var color = "#";
    [r,g,b].forEach(function(c){
        if (c < 16) {color += "0"}
        color += c.toString(16);
    });
    
    return color;
}

function randomShape() {
    var shape = {};
    if (Math.random() < 0.5) {
        // landscape
        shape.width = Math.sqrt(2);
        shape.height = 1;
        shape.orientation = LANDSCAPE;
    } else {
        // portrait
        shape.width = 1 / Math.sqrt(2);
        shape.height = 1;
        shape.orientation = PORTRAIT;
    }
    shape.width *= BASE;
    shape.height *= BASE;
    shape.color = randomColor();
    return shape;
}

function randomShapes(n) {
	var shapes = [];
	for (i=0; i<n; i++) {
		shapes.push(randomShape());
	}
	return shapes;
}

function layoutForShapes(shapes) {
	var layout = [[]];
	var floor = 0;
	var floorWidth = 0;
	
	for (i=0; i < shapes.length-1; i++) {
		if (floorWidth >= 2) {
			layout[floor].scale = 2 / floorWidth;
			layout.push([]);
			floor++;
			floorWidth = 0;
		}
		var shape = shapes[i];
		layout[floor].push(i);
		floorWidth += shape.orientation;
	}
	
	var lastShape = shapes[shapes.length-1];
	if (lastShape.orientation == LANDSCAPE) {
		layout.push([shapes.length-1]);
		layout[layout.length-1].scale = 2;
	} else {
		layout[layout.length-1].push(shapes.length-1);
		if (layout[layout.length-1].scale == 0.8) {
			layout[layout.length-1].scale = 2/3;
		} else {
			layout[layout.length-1].scale = 0.8;
		}
	}
	
	layout.forEach(function(floor){
		floor
	});

	return layout;
}

function renderShape(shape, scale) {
	var r = document.createElement("div");
	r.className = "shape";
	r.style.width = shape.width*scale + "px";
	r.style.height = shape.height*scale + "px";
	r.style.background = shape.color;
	document.body.appendChild(r);
}

function renderBr() {
	document.body.appendChild(document.createElement("br"));
}

function render(shapes, layout) {
	layout.forEach(function(floor){
		floor.forEach(function(i){
			renderShape(shapes[i], floor.scale);
		});
		renderBr();
	});
}