const canvas = document.getElementById('myc');

function add_r3(x, y) {
    return [x[0] + y[0], x[1] + y[1], x[2] + y[2]];
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
        console.log(vertex);
        // (w . (v x z)) / (w . z), (w . z) / (w . v)
        let scale = dot_product(vertex, screen_normal);
        let x = dot_product(vertex, cross_product(screen_normal, head)) / scale;
        console.log(x);
        let y = dot_product(vertex, head) / scale;
        screen_vertices.push([x, y]);
    }
    return screen_vertices;
}

function translate_vertices(vertices, vector)
{
    let new_vertices = [];
    for (let i = 0; i < vertices.length; i++) {
        new_vertices.push(add_r3(vertices[i], vector));
    }
    return new_vertices;
}

function draw_triangle (ctx, p1, p2, p3)
{
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.fill();
}

function draw_object (ctx, faces, vertices) {
    for (let i = 0; i < faces.length; i++) {
        face = faces[i];
        draw_triangle(ctx,
                      vertices[face[0] - 1],
                      vertices[face[1] - 1],
                      vertices[face[2] - 1]);
    }
}

function scale_r3 (c, x) {
    return [c * x[0], c * x[1], c * x[2]];
}

function scale_vertices (c, vertices) {
    let new_vertices = [];
    for (let i = 0; i < vertices.length; i++) {
        new_vertices.push(scale_r3(c, vertices[i]));
    }
    return new_vertices;
}

function draw () {
    let ctx = canvas.getContext('2d');
    screen_bunny = project_vertices(translate_vertices(scale_vertices(100000, bunny_vertices), [0, 0, 0]),
                                    [0, 0, 1],
                                    [0, 1, 0]);
    draw_object(ctx, bunny_faces, screen_bunny);
    return ctx;
}

bunny_vertices;
var ctx = draw();

function clear () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

alert("updated");
