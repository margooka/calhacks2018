canvas = document.getElementById('myc');
canvas.width = 1000;
canvas.height = 1000;

function add_r3(x, y) {
    return [x[0] + y[0], x[1] + y[1], x[2] + y[2]];
}

function add_r2(x, y) {
    return [x[0] + y[0], x[1] + y[1]];
}

function dot_product(x, y) {
    return x[0] * y[0] + x[1] * y[1] + x[2] * y[2]; 
}

function cross_product(x, y) {
    return [x[1] * y[2] - x[2] * y[1],
            x[2] * y[0] - x[0] * y[2],
            x[0] * y[1] - x[1] * y[0]];
}

// Take R3 vertices and project onto a 2d screen one away from the viewer.
// Head is the z unit vector. v is the normal vector to the screen.
function project_vertices(vertices, head, screen_normal)
{
    let screen_vertices = [];
    for (let i = 0; i < vertices.length; i++) {
        vertex = vertices[i];
        // (w . (v x z)) / (w . z), (w . z) / (w . v)
        let scale = dot_product(vertex, screen_normal);
        let x = dot_product(vertex, cross_product(screen_normal, head)) / scale;
        let y = dot_product(vertex, head) / scale;
        screen_vertices.push([x, y, scale]);
    }
    return screen_vertices;
}

function translate_vertices(vertices, vector, translate_func)
{
    let new_vertices = [];
    for (let i = 0; i < vertices.length; i++) {
        new_vertices.push(translate_func(vertices[i], vector));
    }
    return new_vertices;
}

// Draw a triangle with the color of point1
function draw_triangle (ctx, p1, p2, p3, pcolor)
{
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    let alpha = pcolor[2] * 20;
    if (alpha < 0) {
        alpha = 0;
    }
    else {
        alpha = Math.pow(2, -alpha);
    }
    ctx.fillStyle = 'rgba(255,0,0,' + alpha + ')';
    ctx.fill();
}

function draw_object (ctx, faces, vertices) {
    for (let i = 0; i < faces.length; i++) {
        face = faces[i];
        draw_triangle(ctx,
                      vertices[face[0] - 1],
                      vertices[face[1] - 1],
                      vertices[face[2] - 1],
                     vertices[face[0] - 1]);
    }
}

function scale_r3 (c, x) {
    return [c * x[0], c * x[1], c * x[2]];
}

function scale_r2 (c, x) {
    return [c * x[0], c * x[1]];
}

function scale_r2c (c, x) {
    return [c * x[0], c * x[1], x[2]];
}

function scale_vertices (c, vertices, scale_func) {
    let new_vertices = [];
    for (let i = 0; i < vertices.length; i++) {
        new_vertices.push(scale_func(c, vertices[i]));
    }
    return new_vertices;
}

function normalize (v) {
    return scale_r3(1 / Math.sqrt(dot_product(v, v)), v);
}

function draw (x, y, z, theta) {
    let ctx = canvas.getContext('2d');
    let r3_bunny = translate_vertices(scale_vertices(1, bunny_vertices, scale_r3), [x, y, z], add_r3)
    let r2_bunny = project_vertices(r3_bunny,
                                    normalize([0, -1, 0]),
                                    normalize([Math.cos(theta), 0, Math.sin(theta)]));
    let screen_bunny = translate_vertices(scale_vertices(100, r2_bunny, scale_r2c), [canvas.width / 2, canvas.height / 2, 0], add_r3);
    draw_object(ctx, bunny_faces, screen_bunny);
    return ctx;
}

var ctx = draw(0, -1, 0, 0);

function clear () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let x_slider = document.getElementById("x_range");
let y_slider = document.getElementById("y_range");
let z_slider = document.getElementById("z_range");
let theta_slider = document.getElementById("theta_range");

x_slider.oninput = function () {
    clear();
    console.log(x_slider.value);
    draw(x_slider.value / 1000, y_slider.value / 1000, z_slider.value / 1000, theta_slider.value / 20);
}

y_slider.oninput = x_slider.oninput;
z_slider.oninput = x_slider.oninput;
theta_slider.oninput = x_slider.oninput;

alert("updated");
