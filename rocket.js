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
    for(var i = 0; i < 15; i++){
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
    this.sparks = [];

    this.draw = function(){
        push();
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
        angleMode(DEGREES);
        var spark = new Sparks(this.x, this.y, [0, 360], random(1, 5), 5);
        this.sparks.push(spark);
        for(var s in this.sparks){
            this.sparks[s].draw();
        }
        if(this.sparks.length >= 15){
            this.sparks.shift();
        }
    }
};


var Sparks = function(x, y, range, force, intensity){
    this.location = createVector(x, y);
    this.particles = [];
    var colour = [random(0, 255), random(0, 255), random(0, 255)];
    for(var i = 0; i <= intensity; i++){
        var particle = new Particle(x, y, colour, force, floor(random(range[0], range[1])));
        this.particles.push(particle);
    }

    this.velocity = createVector();

    this.draw = function(){
        for(var p in this.particles){
            var particle = this.particles[p];
            particle.move();
            noStroke();
            fill.apply(null, particle.color);
            ellipse(particle.location.x, particle.location.y, 3, 3);
            fill(255);
        }
    };
};

var Particle = function(x, y, color, speed, direction){
    this.location = createVector(x, y);
    this.color = color;
    this.velocity = createVector(speed * cos(direction), speed * sin(direction));


    this.move = function(){
        this.location.add(this.velocity);
    };
};

var Target = function(x, y){
    this.x = x;
    this.y = y;
};