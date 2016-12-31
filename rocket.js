// List of rockets loaded into the game
var rs = [];

// Configuration variables - set in setup
var background_color;
var rocket_dimensions;
var hit_radius;
var spark_limit;

function setup() {
    // Create a full page canvas
    createCanvas(window.innerWidth, window.innerHeight);
    // Amount of Targets to generate
    var target_count = 25;
    // Amount of Rockets to generate
    var rocket_count = 30;
    // Background Colour
    background_color = color(0);
    // Speed of the rockets
    var rocket_speed = 1.05;
    // Dimensions of the rockets
    rocket_dimensions = [0, 0, 20, 2];
    // Radius of a rocket to a target to be a hit
    hit_radius = 10;
    // Amount of Sparks attached to a rocket at a given time
    spark_limit = 15;
    // The class of the target (change to MouseTarget to target the mouse)
    var target_class = RandomTarget;

    // Generate Targets at random positions
    var targets = [];
    for (var x = 0; x < target_count; x++) {
        targets.push(new target_class(random(0, width), random(0, height)));
    }

    // Generate Rockets at random positions
    rs = [];
    for (var i = 0; i < rocket_count; i++) {
        rs.push(new Rocket(random(0, width), random(0, height), rocket_speed, targets[floor(random(0, target_count))]));
    }
}

function draw() {
    background(background_color);
    // Move and draw each rocket
    for (var r in rs) {
        var rocket = rs[r];
        rocket.move();
        rocket.draw();
    }
}


var Rocket = function (x, y, speed, target) {
    // Set the target of the rocket
    this.target = target;
    // Set the speed, location and velocity
    this.speed = speed;
    this.location = createVector(x, y);
    this.velocity = createVector(0, 0);
    // Store the sparks from the rocket
    this.sparks = [];

    this.draw = function () {
        // Draw each spark associated with the rocket
        for (var s in this.sparks) {
            this.sparks[s].draw();
        }
        // Stop drawing the rocket if it has reached the target
        if(this.hasHit()){
            return;
        }
        // Draw the rocket at a rotation
        this.rotate(function () {
            rect.apply(null, rocket_dimensions);
        });
    };

    this.move = function (){
        // Don't move the rocket if it has reached the target
        if(this.hasHit()){
            return;
        }
        // Calculate the acceleration based on the target location
        // Credit to Daniel Shiffman: https://processing.org/examples/accelerationwithvectors.html
        var acceleration = p5.Vector.sub(this.target.getLocation(), this.location);
        acceleration.setMag(this.speed);
        // Increase the velocity to a limit
        this.velocity.add(acceleration);
        this.velocity.limit(20);
        // Update the location based on the velocity
        this.location.add(this.velocity);

        // Create a new spark at the current location
        var spark = new Sparks(this.location.x, this.location.y, [0, 360], random(1, 5), 2);
        this.sparks.push(spark);
        // Start removing sparks at the spark limit
        if (this.sparks.length >= spark_limit) {
            this.sparks.shift();
        }
    };

    this.hasHit = function(){
        // Determine if the rocket is within the hit radius of the target
        if(this.location.x >= this.target.getX() - hit_radius && this.location.x <= this.target.getX() + hit_radius){
            if(this.location.y >= this.target.getY() - hit_radius && this.location.y <= this.target.getY() + hit_radius){
                return true;
            }
        }
        return false;
    };

    this.rotate = function(draw_func){
        // Rotate the rocket to face the target
        push();
        translate(this.location.x, this.location.y);
        rotate(this.velocity.heading());
        rectMode(CENTER);
        draw_func();
        pop();
    };
};


var Sparks = function (x, y, range, force, intensity) {
    // Set the Sparks location and velocity
    this.location = createVector(x, y);
    this.velocity = createVector();

    // Populate the list of particles with new particles
    this.particles = [];
    var colour = [random(0, 255), random(0, 255), random(0, 255)];
    for (var i = 0; i <= intensity; i++) {
        var particle = new Particle(x, y, colour, force, floor(random(range[0], range[1])));
        this.particles.push(particle);
    }

    this.draw = function () {
        for (var p in this.particles) {
            var particle = this.particles[p];
            particle.move();
            particle.draw();
        }
    };
};


var Particle = function (x, y, color, speed, direction) {
    this.color = color;

    // Set the location of the particle and calculate the velocity
    this.location = createVector(x, y);
    this.velocity = createVector(speed * cos(radians(direction)), speed * sin(radians(direction)));

    this.move = function () {
        // Update the location based on the velocity
        this.location.add(this.velocity);
    };

    this.draw = function () {
        // Draw an ellipse to represent the particle
        fill.apply(null, this.color);
        ellipse(this.location.x, this.location.y, 3, 3);
        fill(255);
    };
};


// The default target type which targets a specific x and y
var Target = function (x, y) {
    this.x = x;
    this.y = y;

    this.getX = function(){
        return this.x;
    };

    this.getY = function(){
        return this.y;
    };

    this.getLocation = function(){
        return createVector(this.getX(), this.getY());
    }
};

// Target the mouse location
var MouseTarget = function(x, y){
    this.getX = function(){
        return mouseX;
    };

    this.getY = function(){
        return mouseY;
    };

    this.getLocation = function () {
        return createVector(this.getX(), this.getY());
    }
};

// Target the position most of the time but adds some random positions
var RandomTarget = function (x, y) {
    this.x = x;
    this.y = y;

    this.getX = function(){
        if(random(0, 8) <= 2){
            return random(0, width);
        }
        return this.x;
    };

    this.getY = function(){
        if(random(0, 8) <= 2){
            return random(0, height);
        }
        return this.y;
    };

    this.getLocation = function(){
        return createVector(this.getX(), this.getY());
    }
};