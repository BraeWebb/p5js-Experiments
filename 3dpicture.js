// The image to load and the list of pixels
var img;
var pixels = [];

function preload() {
    loadConfig();
    image_name = decodeURIComponent(image_name);
    sort_function = eval(decodeURIComponent(sort_function).replace(/%20/g, ' '));

    img = loadImage(image_name);
}

function setup() {
    // Create a full page canvas with WEBGL
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);

    // Populate the pixels array with image data
    img.loadPixels();
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            var pixel = [x, y, sort_function(img.get(x, y)), img.get(x, y)];
            pixels.push(pixel);
        }
    }
}

function draw(){
    // Allow the 3D image to be rotated
    orbitControl();
    // Position the image in the center of the screen
    translate(-img.width*image_scale/2, -img.height*image_scale/2);
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
    var x = pixel[0] * image_scale;
    var y = pixel[1] * image_scale;
    var z = pixel[2];
    // Draw the initial pixel
    vertex(x,y,z);
    if(detail){
        // If a detailed pixel is used then add more vertexes forming a square
        vertex(x+image_scale,y,z);
        vertex(x+image_scale,y+image_scale,z);
        vertex(x,y+image_scale,z);
        vertex(x,y,z);
    }
}