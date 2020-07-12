// Most of this is by Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// I changed the words
//for sam kendizora

let font;
let vehicles = [];

let texts = ['BATMAN', 'SUPERMAN', 'WONDERWOMAN', 'THE FLASH','AQUAMAN', 'GREENLANTERN', 'MARTIAN MANHUNTER', 'CYBORG'];
let nextT = 0;
let maxChangeForce = 20;

let instructions = [];
let insText = '';



function preload() {
    font = loadFont('arialbd.ttf');
}

function Vehicle(x, y, size) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    if (size != null) {
        this.r = size;
    } else {
        this.r = 6;
    }
    this.maxspeed = 15;
    this.maxforce = 1;


}

Vehicle.prototype.behaviors = function () {
    var arrive = this.arrive(this.target);
    var mouse = createVector(mouseX, mouseY);
    var flee = this.flee(mouse);

    arrive.mult(1);
    flee.mult(10);

    this.applyForce(arrive);
    this.applyForce(flee);
}

Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
}

Vehicle.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
}

Vehicle.prototype.show = function () {
    

    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  
}


Vehicle.prototype.arrive = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    if (d < 200) {
        speed = map(d, 0, 200, 0, this.maxspeed);
    }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
}

Vehicle.prototype.flee = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < 100) {
        desired.setMag(this.maxspeed);
        desired.mult(-1);
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return createVector(0, 0);
    }
}

Vehicle.prototype.clone = function () {
    var v = new Vehicle(this.pos.x, this.pos.y);

    v.pos.x = this.pos.x;
    v.pos.y = this.pos.y;

    v.vel.x = this.vel.x;
    v.vel.y = this.vel.y;

    v.acc.x = this.acc.x;
    v.acc.y = this.acc.y;

    return v;
}



function setup() {
	createCanvas(1515,500);
    background(0);

    let bounds = font.textBounds(texts[nextT], 0, 0, 80);
    let posx = width / 2 - bounds.w / 2;
    let posy = height / 2 + bounds.h / 2;

    let points = font.textToPoints(texts[nextT], posx, posy, 80, {
        sampleFactor: 0.1
    });

    for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        let vehicle = new Vehicle(pt.x, pt.y);
        vehicles.push(vehicle);
    }

    let boundsIns = font.textBounds(insText, 0, 0, 30);
    let posxIns = width / 2 - boundsIns.w / 2;
    let posyIns = height / 6 + boundsIns.h / 2;

    let insAr = split(insText, ' ');

    for (let i = 0; i < insAr.length; i++) {
        let bounds2 = font.textBounds(insAr[i], 0, 0, 30);
        let posx2 = posxIns;
        let posy2 = posyIns;

        posxIns += bounds2.w + 10;

        let points2 = font.textToPoints(insAr[i], posx2, posy2, 30, {
            sampleFactor: 0.3
        });

        for (let j = 0; j < points2.length; j++) {
            let pt = points2[j];
            let v = new Vehicle(pt.x, pt.y, 1);
            instructions.push(v);
        }
    }
}

function draw() {
    background(0);

    for (let i = 0; i < instructions.length; i++) {
        let v = instructions[i];
        v.behaviors();
        v.update();
        v.show();
    }

    for (let i = 0; i < vehicles.length; i++) {
        let v = vehicles[i];
        v.behaviors();
        v.update();
        v.show();
    }
    
    let tipText = "Left-click for a new word.";
    tipText += "\nDrag mouse over particles to interact with them.";
    fill(255);

    text(tipText, 10, height-40);
}

function mouseClicked() {

	if(mouseX<1515&&mouseX>0&&mouseY<500&&mouseY>0){
    stroke(random(0,255),random(0,255),random(0,255));

    nextT++;
    if (nextT > texts.length - 1) {
        nextT = 0;
    }

    let bounds = font.textBounds(texts[nextT], 0, 0, 80);
    let posx = width / 2 - bounds.w / 2;
    let posy = height / 2 + bounds.h / 2;

    let points = font.textToPoints(texts[nextT], posx, posy, 80, {
        sampleFactor: 0.1
    });

    if (points.length < vehicles.length) {
        let toSplice = vehicles.length - points.length;
        vehicles.splice(points.length - 1, toSplice);

        for (let i = 0; i < points.length; i++) {
            vehicles[i].target.x = points[i].x;
            vehicles[i].target.y = points[i].y;

            let force = p5.Vector.random2D();
            force.mult(random(maxChangeForce));
            vehicles[i].applyForce(force);
        }
    } else if (points.length > vehicles.length) {

        for (let i = vehicles.length; i < points.length; i++) {
            let v = vehicles[i - vehicles.length].clone();

            vehicles.push(v);
        }

        for (let i = 0; i < points.length; i++) {
            vehicles[i].target.x = points[i].x;
            vehicles[i].target.y = points[i].y;

            let force = p5.Vector.random2D();
            force.mult(random(maxChangeForce));
            vehicles[i].applyForce(force);
        }

    } else {
        for (let i = 0; i < points.length; i++) {
            vehicles[i].target.x = points[i].x;
            vehicles[i].target.y = points[i].y;

            let force = p5.Vector.random2D();
            force.mult(random(maxChangeForce));
            vehicles[i].applyForce(force);
        }
    }
}
}