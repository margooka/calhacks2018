
//I'm stupid, so let's write some vector-ey things
function v_minus(vec1,vec2){
	//Takes two arrays of numbers and tries to subtract them, returning
	//	vec1-vec2
	if (vec1.length != vec2.length){
		console.log('You tried to minus two things that are different lengths');
		return None;
	}
	answer = [];
	for (var i = 0; i < vec1.length; i++){
		//The reason for using answer is I'm scared of mutable stuff
		answer.push(vec1[i] - vec2[i]);
	}
	return answer;
}

function v_add(vec1,vec2){
	//Takes two arrays of numbers and tries to subtract them, returning
	//	vec1-vec2
	if (vec1.length != vec2.length){
		console.log('You tried to add two things that are different lengths');
		return None;
	}
	answer = [];
	for (var i = 0; i < vec1.length; i++){
		//The reason for using answer is I'm scared of mutable stuff
		answer.push(vec1[i] + vec2[i]);
	}
	return answer;
}

function v_dot(vec1, vec2){
	//Takes two arrays of numbers and tries to take the dot product, returning
	//	vec1 \cdot vec2
	if (vec1.length != vec2.length){
		console.log('You tried to dot two things that are different lengths');
		return None;
	}
	answer = 0;
	for (var i = 0; i < vec1.lenegth; i++){
		answer = answer + vec1[i]*vec2[i];
	}
	return answer;
}

function v_scale(con,vec){
	//Scales vec by the constant con
	answer = [];
	for (var i = 0; i < vec.length; i++){
		answer.push(vec[i]*con);
	}
	return answer;
}

function v_mag(vec){
	//Finds the magnitude of a vector
	answer = 0;
	for (var i = 0; i < vec.length; i++){
		answer = answer + Math.pow(vec[i],2)
	}
	return Math.pow(answer,1/2)
}



function lorentz(point, pos, vel, mag){
	//This takes a point and transforms given pos, vel.
	//Naively, things only get contracted along the direction of motion, so we want something like
	//x' = gamma (x-vt)

	//Lets set c
	c = 1;

	//Lets figure out what gamma is
	gamma = 1/Math.pow(1-Math.pow(mag/c,2),1/2);

	//so first I need the relative vector
	//rel = [point[0]-pos[0],point[1]-pos[1],point[2]-pos[2]];
	rel = v_minus(point,pos);

	//Then I need to decompose into parallel to vel, and orthogonal to vel components
	dot = v_dot(rel,vel)

	//Then I need to scale the parallel component according to the lorentz contraction law
	rel = v_add(v_minus(rel,v_scale(dot,vel)),v_scale(gamma*dot,vel));

	//Then reshift the coordinates
	return v_add(rel,point);
}


function transform(points, pos, vel, mag){
	//	Points is an array of R^3 points, [x,y,z]
	//	pos is a point in R^3
	//	vel is a vector in R^3
	//	mag is the magnitude of the velocity vector. Can be zero, in which case
	//	  the vel is just the orientation vector, that shows how we project our clout
	//	  of points. 

	//The return of transform is another array of points. 
	var new_points = [];
	for (var i = 0; i < points.length; i++){
		new_points.push(lorentz(points[i],pos,vel,mag));
	}
	return new_points;
}
