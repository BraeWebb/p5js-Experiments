var rs = [];

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    var targets = [
        new Target(random(0, width), random(0, height)),
        new Target(random(0, width), random(0, height)),
        new Target(random(0, width), random(0, height)),
        new Target(random(0, width), random(0, height)),
        new Target(random(0, width), random(0, height)),
        new Target(random(0, width), random(0, height))
    ];
    for(var i = 0; i < 100; i++){
        rs.push(new Rocket(random(0, width), random(0, height), targets[floor(random(0, 6))]));
    }
    print(rs);
}

function draw(){
    stroke(255);
    background(100);
    for(var r in rs){
        var rocket = rs[r];
        rocket.draw();
    }
}


var Rocket = function(x, y, target){
    this.target = target;
    this.x = x;
    this.y = y;
    this.acceleration = 0;
    this.velocity = createVector();
    this.speed = 0.001;

    this.draw = function(){
        push();
        //noStroke();
        //fill(255, 150);
        translate(this.x, this.y);
        rotate(p5.Vector.angleBetween(createVector(this.x, this.y), createVector(this.target.x, this.target.y)));
        rectMode(CENTER);
        rect(0, 0, 25, 5);
        pop();
        this.acceleration += this.speed;
        this.velocity.add(this.acceleration);
        if(this.target) {
            var dx = this.target.x - this.x;
            this.x += dx * this.acceleration;

            var dy = this.target.y - this.y;
            this.y += dy * this.acceleration;
        }
    }
};

var Target = function(x, y){
    this.x = x;
    this.y = y;
};