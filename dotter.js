var dots = [];
var lines = [];

function preload(){
    loadConfig();
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    stroke(foreground_color);
    for(var i = 0; i < dot_count; i++){
        dots.push(new Dot(random(0, width), random(0, height)));
    }
    for(var x = 0; x < line_count; x++){
        lines.push(new Line(floor(random(0, dot_count))));
    }
}

function draw(){
    background(background_color);
    text(dots.length, 50, 50);
    for(var l in lines){
        var drawer = lines[l];
        if(drawer.connected.length == dots.length){
            drawer.retract();
        }else{
            drawer.expand();
        }
        drawer.draw();
    }
    for(var d in dots){
        var dot = dots[d];
        if(dist(mouseX, mouseY, dot.x, dot.y) <= mouse_radius){
            dot.moveAwayFrom(mouseX, mouseY);
        }
        dot.scatter();
        dot.draw();
    }
}

var Dot = function(x, y){
    this.x = x;
    this.y = y;
    this.size = random(dot_size - resize_range, dot_size + resize_range);
    this.exploding = false;
    this.children = [];

    this.draw = function(){
        if(this.exploding){
            this.handleExplode();
        }else {
            if (random() < resize_probability) {
                this.size += random(-resize_range, resize_range)
            }
            if(this.size >= size_limit){
                if(dots.length < dot_limit){
                    this.explode();
                }else{
                    this.exploding = true;
                }
            }
        }
        fill(color(noise(this.x/width, this.y/height)*255));
        noStroke();
        ellipse(this.x, this.y, this.size);
    };

    this.scatter = function(){
        if(random() < scatter_probability){
            var xShift = random(-scatter_range, scatter_range);
            var yShift = random(-scatter_range, scatter_range);
            if(this.canMoveX(xShift)) {
                this.x += xShift;
            }
            if(this.canMoveY(yShift)) {
                this.y += yShift;
            }
        }
    };

    this.moveAwayFrom = function(x, y){
        var dx = this.x - x;
        var dy = this.y - y;
        dx = map(dx, 0, width, 0, 10);
        dy = map(dy, 0, height, 0, 10);
        if(this.canMoveX(dx)) this.x += dx;
        if(this.canMoveY(dy)) this.y += dy;
    };

    this.moveToward = function(x, y, step){
        var dx = x - this.x;
        var dy = y - this.y;
        dx = map(dx, 0, width, 0, 10);
        dy = map(dy, 0, height, 0, 10);
        if(this.canMoveX(dx)) this.x += dx;
        if(this.canMoveY(dy)) this.y += dy;
    };

    this.canMoveX = function(shift){
        return this.x - this.size + shift > 0 && this.x + this.size + shift <= width
    };

    this.canMoveY = function(shift){
        return this.y - this.size + shift > 0 && this.y + this.size + shift <= height
    };

    this.explode = function(){
        if(this.exploding) return;
        this.exploding = true;
        for(var i = 0; i < respawn_amount; i++){
            this.children.push(new Dot(random(this.x-20, this.x+20), random(this.y-20, this.y+20)));
        }
    };

    this.handleExplode = function(){
        for(var c in this.children){
            var child = this.children[c];
            child.moveAwayFrom(this.x, this.y);
            child.draw();
        }
        if(this.size >= 1){
            this.size--;
        }else{
            dots.push.apply(dots, this.children);
            this.exploding = false;
        }
    };
};


var Line = function(start){
    this.connections = [];
    this.connected = [start];
    this.pointer = dots[start];

    this.draw = function(){
        for(var c in this.connections){
            var connection = this.connections[c];
            //print(this.connections);
            stroke(color(noise(connection[0].x/width, connection[0].x/height)*255));
            line(connection[0].x, connection[0].y, connection[1].x, connection[1].y);
        }
    };

    this.expand = function(){
        var minDist = 999999999999;
        var closest = undefined;
        for(var d in dots){
            var dot = dots[d];
            var d = parseInt(d);
            if(!this.connected.contains(d)) {
                var distance = abs(this.pointer.x - dot.x) + abs(this.pointer.y - dot.y);
                if (distance < minDist) {
                    minDist = distance;
                    closest = d;
                }
            }
        }
        this.connected.push(closest);
        this.connections.push([this.pointer, dots[closest]]);
        this.pointer = dots[closest];
    };

    this.retract = function(){
        for(var c in this.connections){
            var connection = this.connections[c];
            connection[0].moveToward(connection[1].x, connection[1].y);
            connection[1].moveToward(connection[0].x, connection[0].y);
        }
    };
};