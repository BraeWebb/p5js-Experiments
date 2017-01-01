// The image to load and the list of pixels
var img;
var pixels = [];

// Configuration variables - set in preload
var detail;
var sortFunc;
var scale;


function preload() {
    // The image to use. NOTE: the files need to be on a webserver to allow this
    var imgName = "example.jpg";
    // Whether the image is detailed
    detail = true;
    // The scale of the image
    scale = 5;
    // The function used to place pixels in the z axis
    sortFunc = function(pixel) {return -brightness(pixel);};

    img = loadImage(imgName);
}

function setup() {
    // Create a full page canvas with WEBGL
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);

    // Populate the pixels array with image data
    img.loadPixels();
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            var pixel = [x, y, sortFunc(img.get(x, y)), img.get(x, y)];
            pixels.push(pixel);
        }
    }
}

function draw(){
    // Allow the 3D image to be rotated
    orbitControl();
    // Position the image in the center of the screen
    translate(-img.width*scale/2, -img.height*scale/2);
    // Draw each pixel as a shape
    beginShape();
    for (var b in pixels) {
        drawPixel(pixels[b]);
    }
    endShape();
}

function drawPixel(pixel){
    // Colour the pixel the appropriate colour
    fill(pixel[3]);
    // Calculate the scaled x, y and z locations of the pixel
    var x = pixel[0] * scale;
    var y = pixel[1] * scale;
    var z = pixel[2];
    // Draw the initial pixel
    vertex(x,y,z);
    if(detail){
        // If a detailed pixel is used then add more vertexes forming a square
        vertex(x+scale,y,z);
        vertex(x+scale,y+scale,z);
        vertex(x,y+scale,z);
        vertex(x,y,z);
    }
}