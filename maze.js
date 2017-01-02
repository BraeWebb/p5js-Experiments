var g;

function preload(){
    loadConfig();
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(60);
    g = new Grid(hexagon_size, pointer_count);
}

function draw(){
    stroke(foreground_color);
    background(background_color);
    g.draw();
}

var Grid = function(size, pointers){
    var w = size*2;
    var h = Math.sqrt(3)/2 * size * 2;
    this.w = w;
    this.h = h;
    this.iCount = floor(width/h);
    this.jCount = floor((height/w)/0.75);
    this.hexagons = [];
    this.pointers = [];
    this.pointerCount = pointers;

    for (var i = 0; i < this.iCount; i++){
        for (var j = 0; j < this.jCount; j++){
            var x = (j % 2 != 0) ? h*i+h : h*i+(h/2);
            var y = (j % 2 != 0) ? w*(j*0.75)+(w/2) : w*(j*0.75)+(w/2);
            this.hexagons.push(new Hexagon(this, x, y, i, j));
        }
    }
    for(var p = 0; p < this.pointerCount; p++){
        var start = this.hexagons[Math.floor(Math.random() * this.hexagons.length)];
        this.pointers.push(new Pointer(start));
    }

    this.draw = function () {
        for(var h in this.hexagons){
            var hex = this.hexagons[h];
            hex.draw();
        }
        for(var p in this.pointers){
            var pointer = this.pointers[p];
            if(pointer.current){
                if(leave_breadcrumbs) {
                    for (var p in pointer.visited) {
                        var place = pointer.visited[p];
                        ellipse(place.x, place.y, 5);
                    }
                }
                ellipse(pointer.current.x, pointer.current.y, pointer_size);
                pointer.move();
            }

        }
    }
};

var directions = [
    [ [-1, +1], [-1,  0], [-1, -1], [ 0, -1], [+1,  0], [ 0, +1] ],
    [ [ 0, +1], [-1,  0], [ 0, -1], [+1, -1], [+1,  0], [+1, +1] ]
];

var Hexagon = function(g, x, y, i, j){
    this.x = x;
    this.y = y;
    this.i = i;
    this.j = j;
    this.sides = [false, true, true, true, true, true, true];
    this.visited = false;

    this.draw = function(){
        if (this.visited){
            stroke(foreground_color);
        }else{
            stroke(shadow_color);
        }
        drawHexagon(this.x, this.y, g.w/2, this.sides);
    };

    this.neighbour = function(direction){
        var parity = this.j % 2;
        var dir = directions[parity][direction];
        var idir = i+dir[0];
        var jdir = j+dir[1];
        if(idir >= 0 && jdir >= 0 && idir < g.iCount && jdir < g.jCount){
            return  g.hexagons[g.jCount * idir + jdir];
        }else{
            return undefined;
        }
    };

    this.canMove = function(){
        var directions = [0, 1, 2, 3, 4, 5];
        for (var dir in directions){
            if (this.neighbour(dir) && !this.neighbour(dir).visited){
                return true
            }
        }
        return false;
    };
    
    this.move = function () {
        this.visited = true;
        var next = undefined;
        while(!next || next.visited) {
            var index = Math.floor((Math.random() * 6));
            next = this.neighbour(index);
        }
        return this.neighbour(index);
    };

    this.removeSide = function(side){
        this.sides[side] = false;
        var neighbour = this.neighbour(side-1);
        if(neighbour){
            if(side == 3) neighbour.sides[6] = false;
            else neighbour.sides[(side+3)%6] = false;
        }
    };
};

var side_id = [
    [ [+1, -1], [+1,  0], [+1, +1], [ 0, +1], [-1,  0], [ 0, -1] ],
    [ [ 0, -1], [+1,  0], [ 0, +1], [-1, +1], [-1,  0], [-1, -1] ]
];

var Pointer = function(start){
    this.start = start;
    this.current = start;
    this.last = start;
    this.top = undefined;
    this.visited = [];

    this.move = function(){
        ellipse(this.start.x, this.start.y, 5);
        this.current.visited = true;
        if (this.current.canMove()) {
            if(this.top){
                this.top = undefined;
            }
            var next = this.current.move();
            if (!next.visited) {
                this.visited.push(next);
                this.last = this.current;
                this.current = next;
                var parity = this.current.j % 2;
                var id = [this.current.i-this.last.i, this.current.j-this.last.j];
                this.current.removeSide(side_id[parity].indexOf(id)+1);
            }
        }else{
            var popped = this.visited.pop();
            if(!this.top){
                this.top = popped;
            }
            ellipse(this.top.x, this.top.y, 5);
            this.current = popped;
        }
    };
};

function drawHexagon(x, y, radius, lines) {
    var angle = TWO_PI / 6;
    var lastx = x;
    var lasty = y;
    var linenum = 0;
    for (var a = PI/2; a < TWO_PI+(PI/2); a += angle) {
        var sx = x + cos(a) * radius;
        var sy = y + sin(a) * radius;
        if (lines[linenum]) {
            line(lastx, lasty, sx, sy);
        }
        lastx = sx;
        lasty = sy;
        linenum++;
    }
}