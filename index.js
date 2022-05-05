import * as THREE from 'three'
// import {TrackballControls} from 'three/examples/jsm/controls/OrbitControls';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
import { Camera, Scene, Renderer, Shape } from './lib/threeD.js';
import { TrackballControls } from 'TrackballControls'
import { FirstPersonControls } from 'FirstPersonControls'
// import { TrackballControls } from './lib/trackball.js'
// import TrackballControls from 'https://cdn.jsdelivr.net/npm/three-trackballcontrols@0.0.8/index.min.js';
// import { TrackballControls } from 'https://unpkg.com/browse/three@0.92.0/examples/js/controls/TrackballControls.js';
// import TrackballControls from 'https://cdn.jsdelivr.net/npm/three-trackballcontrols@0.0.8/index.min.js';
// import structuredClone from "@ungap/structuredimport TrackballControls from 'https://cdn.jsdelivr.net/npm/three-trackballcontrols@0.0.8/index.min.js';-clone"

let camera = new Camera()
camera.position.z = 8;

let scene = new Scene()
let renderer = new Renderer()

renderer.setSize(window.innerWidth, window.innerHeight);
let canvas = renderer.domElement;
document.body.appendChild(canvas);

scene.background = new THREE.Color(0xe5e5e5);

let loader = new OBJLoader();
const textureLoader = new THREE.TextureLoader()
const grassTexture = textureLoader.load( "images/Stylized_Grass.jpg" );
const rockTexture = textureLoader.load( "images/stone.jpg" );
const soccerTexture = textureLoader.load( "images/football.jpg" );
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
rockTexture.wrapS = THREE.RepeatWrapping;
rockTexture.wrapT = THREE.RepeatWrapping;
function loadMeshObj(file, name, objColor=0xffffff, ka=0.4, kd=0.4, ks=0.4, scale = [1,1,1], pos=[0,0,0], rotate=[1,1,1] , texture="NULL") {

    loader.load(
        // resource URL
        file,
        // called when resource is loaded
        function (object) {
            object.traverse(function (obj) {
                if (obj.isMesh) {
                    // obj.geometry.mergeVertices()
                    if(texture === "NULL"){
                        obj.material = new THREE.MeshLambertMaterial()
                    }
                    else{
                        obj.material = new THREE.MeshLambertMaterial(
                            {
                                map: texture
                            }
                        )
                    }
                    // console.log(Scene)
                    scene.setMaterialProperties(obj.material,ka,kd,ks)
                    obj.material.color.setHex(objColor);
                }
            });

            object.name = name;
            object.position['x'] = pos[0]
            object.position['y'] = pos[1]
            object.position['z'] = pos[2]
            object.scale['x'] = scale[0]
            object.scale['y'] = scale[1]
            object.scale['z'] = scale[2]
            object.rotateX(rotate[0])
            object.rotateY(rotate[1])
            object.rotateZ(rotate[2])

            scene.add(object)
            scene.primitives += 1;
        },
    );
    // scene.primitives += 1;
}

loadMeshObj('./objects/football_field.obj', "field", 0x00ff00, 0.4,0.4,0.4, [0.4,0.4,0.4],[0,0,0],[Math.PI/2,Math.PI/2,0], grassTexture);
loadMeshObj('./objects/football_player.obj', "player_1", 0x00ffff, 0.4,0.4,0.4, [1,1,1],[-1,0,0],[1.5,1.5,0]);
loadMeshObj('./objects/football_player.obj', "player_2", 0x0000ff, 0.4,0.4,0.4, [1,1,1],[1,0,0],[1.5,-1.5,0]);
loadMeshObj('./objects/sphere.obj', "ball", 0xffffff, 0.4,0.4,0.4, [0.2,0.2,0.2],[0,0,0.22],[1.5,-1.5,0],soccerTexture);
loadMeshObj('./objects/teapot.obj', "teapot", 0xffffff, 0.4,0.4,0.4, [0.2,0.2,0.2],[-2,-4,0],[0,0,0],rockTexture);
loadMeshObj('./objects/urn.obj', "urn", 0xffffff, 0.4,0.4,0.4, [0.3,0.3,0.3],[-2,4,0.3],[Math.PI/2,0,0],rockTexture);
loadMeshObj('./objects/canstick.obj', "canstick", 0xffffff, 0.4,0.4,0.4, [5,5,5],[2,4,0.5],[Math.PI/2,0,0],rockTexture);
loadMeshObj('./objects/sphere.obj', "sphere", 0xffffff, 0.4,0.4,0.4, [0.4,0.4,0.4],[2,-4,0.4],[Math.PI/2,0,0],rockTexture);
loadMeshObj('./objects/goal.obj', "goal_1" , 0x000000, 0.4,0.4,0.4, [3.2,1,1],[11.4,-3.5,0.05],[Math.PI/2,Math.PI/2,0]);
loadMeshObj('./objects/goal.obj', "goal_2", 0x000000, 0.4,0.4,0.4, [3.2,1,1],[-11.2,-3.5,0.36],[-0,0,Math.PI/2]);

const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
const points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 0, 4, 0 ) );
points.push( new THREE.Vector3( 0, -4, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( geometry, material );
scene.add( line );

let offset = 0.7;

function getBall(player,ball) {
    let bbox = new THREE.Box3().setFromObject(player)
    let pos = ball.position
    if(ball.parent != scene){
        pos = ball.parent.position
    }
    if (
        pos['x'] > bbox.min['x'] - offset &&
        pos['x'] < bbox.max['x'] + offset &&
        pos['y'] > bbox.min['y'] - offset &&
        pos['y'] < bbox.max['y'] + offset
        ) {
            let ballPos = new THREE.Vector3()
            ball.getWorldPosition(ballPos)

            if(player == player1){
                playerWithBall = player1
                player1.add(ball)
            } 
            else {
                playerWithBall = player2
                player2.add(ball)
            }

            // if(ball.parent == scene && animBall_kick) {
            //     ball.worldToLocal(ballPos)
            //     ball.position.set(ballPos.x,ballPos.y,ballPos.z)
            //     animBall_kick = false;
            // }
            ball.worldToLocal(ballPos)
            ball.position.set(ballPos.x,ballPos.y,ballPos.z)
            animBall_kick = false;
            animBall_dribble = false;
            animBall_random = false;
        }
    console.log(player_ball)
    
}

scene.addLight("l3")

// let spotLight2 = new THREE.SpotLight( 0xffffff );


const controls = new TrackballControls(camera, renderer.domElement)

let dictionary_keys = {};

function checkKeys()
{
    for (const [key_pressed, value] of Object.entries(dictionary_keys))
    {
        // console.log(key_pressed + " " + value);
        if(value == false)
            continue;

        /**
         * Player 1 controls
         */

        if(key_pressed == "a")
        {
            if(flag == 0){
                player1.position['x'] -= 0.05
                camera_player_1.position['x'] -= 0.05
            }
            else if (flag == 1)
            {
                player1.position['y'] += 0.05
                camera_player_1.position['y'] += 0.05
            }
            else if (flag == 2)
            {
                player1.position['y'] -= 0.05
                camera_player_1.position['y'] -= 0.05
            }
        }
        else if(key_pressed == "d")
        {
            if(flag == 0){
                player1.position['x'] += 0.05
                camera_player_1.position['x'] += 0.05
            }
            else if (flag == 1)
            {
                player1.position['y'] -= 0.05
                camera_player_1.position['y'] -= 0.05
            }
            else if (flag == 2)
            {
                player1.position['y'] += 0.05
                camera_player_1.position['y'] += 0.05
            }
        }
        else if(key_pressed == "w")
        {
            if(flag == 0){
                player1.position['y'] += 0.05
                camera_player_1.position['y'] += 0.05
            }
            else if (flag == 1)
            {
                player1.position['x'] += 0.05
                camera_player_1.position['x'] += 0.05
            }
            else if (flag == 2)
            {
                player1.position['x'] -= 0.05
                camera_player_1.position['x'] -= 0.05
            }
        }
        else if(key_pressed == "s")
        {
            if(flag == 0){
                player1.position['y'] -= 0.05
                camera_player_1.position['y'] -= 0.05
            }
            else if (flag == 1)
            {
                player1.position['x'] -= 0.05
                camera_player_1.position['x'] -= 0.05
            }
            else if (flag == 2)
            {
                player1.position['x'] += 0.05
                camera_player_1.position['x'] += 0.05
            }
        }
        else if (key_pressed == "(")
        {
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), Math.PI / 180 );
            player1.applyQuaternion( quaternion );
            camera_player_1.applyQuaternion( quaternion );
        }
    
        else if (key_pressed == ")")
        {
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), -Math.PI / 180 );
            player1.applyQuaternion( quaternion );
            camera_player_1.applyQuaternion( quaternion );
        }


        /**
         * Player 2 controls
         */

        else if(key_pressed == "ArrowLeft")
        {
            if(flag == 0){
                player2.position['x'] -= 0.05
                camera_player_2.position['x'] -= 0.05
            }
            else if (flag == 1)
            {
                player2.position['y'] += 0.05
                camera_player_2.position['y'] += 0.05
            }
            else if (flag == 2)
            {
                player2.position['y'] -= 0.05
                camera_player_2.position['y'] -= 0.05
            }
        }
        else if(key_pressed == "ArrowRight")    
        {
            if(flag == 0){
                player2.position['x'] += 0.05
                camera_player_2.position['x'] += 0.05
            }
            else if (flag == 1)
            {
                player2.position['y'] -= 0.05
                camera_player_2.position['y'] -= 0.05
            }
            else if (flag == 2)
            {
                player2.position['y'] += 0.05
                camera_player_2.position['y'] += 0.05
            }
        }
        else if(key_pressed == "ArrowUp")
        {
            if(flag == 0){
                player2.position['y'] += 0.05
                camera_player_2.position['y'] += 0.05
            }
            else if (flag == 1)
            {
                player2.position['x'] += 0.05
                camera_player_2.position['x'] += 0.05
            }
            else if (flag == 2)
            {
                player2.position['x'] -= 0.05
                camera_player_2.position['x'] -= 0.05
            }
        }
        else if(key_pressed == "ArrowDown")
        {
            if(flag == 0){
                player2.position['y'] -= 0.05
                camera_player_2.position['y'] -= 0.05
            }
            else if (flag == 1)
            {
                player2.position['x'] -= 0.05
                camera_player_2.position['x'] -= 0.05
            }
            else if (flag == 2)
            {
                player2.position['x'] += 0.05
                camera_player_2.position['x'] += 0.05
            }
        }
        else if (key_pressed == "[")
        {
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), Math.PI / 180 );
            player2.applyQuaternion( quaternion );
            camera_player_2.applyQuaternion( quaternion );
        }
    
        else if (key_pressed == "]")
        {
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), -Math.PI / 180 );
            player2.applyQuaternion( quaternion );
            camera_player_2.applyQuaternion( quaternion );
        }

        else if (key_pressed == 'q') {
            getBall(player1, ball)
        }
    
        else if (key_pressed == 'p') {
            getBall(player2, ball)
        }

    }
}

let flag = 0;
let camera_player_1 = new Camera();
let camera_player_2 = new Camera();
let init = 0;
let player_ball = new THREE.Group();
let player1
let player2
let ball
scene.add(player_ball)
let obstacles = [];

let c = 0
let spotLight1 = new THREE.SpotLight( 0xffffff );
// spotLight1.rotation.set(0,Math.PI,0)
// spotLight1.rotateOnAxis(new THREE.Vector3(0,1,0), 90*Math.PI/180);
// spotLight1.rotateY(Math.PI/2)
// scene.add(spotLight1)

document.addEventListener('keydown', function (event)
{

    dictionary_keys[event.key] = true;
    if(init == 0)
    {
        init = 1;

        player1 = scene.getObjectByName("player_1");
        player2 = scene.getObjectByName("player_2")
        
        // player1.add(spotLight1)
        let meshPos = new THREE.Vector3()
        // spotLight1.position['y']-=0.005
        spotLight1.getWorldRotation(meshPos)
        console.log(meshPos);

        obstacles.push(scene.getObjectByName("sphere"))
        obstacles.push(scene.getObjectByName("teapot"))
        obstacles.push(scene.getObjectByName("urn"))
        obstacles.push(scene.getObjectByName("canstick"))

        ball = scene.getObjectByName("ball")
        player_ball.add(ball)

        let p1 = scene.getObjectByName("player_1");
        let pos1 = p1.position;
        camera_player_1.position.x = pos1['x'];
        camera_player_1.position.y = pos1['y'];
        camera_player_1.position.z = pos1['z']+1.2;


        let la_1 = new THREE.Vector3(-0.8,0,1.2);
        camera_player_1.lookAt(la_1);

        const quaternion_1 = new THREE.Quaternion();
		quaternion_1.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI/2);
		camera_player_1.applyQuaternion( quaternion_1 );

        let p2 = scene.getObjectByName("player_2");
        let pos2 = p2.position;
        camera_player_2.position.x = pos2['x'];
        camera_player_2.position.y = pos2['y'];
        camera_player_2.position.z = pos2['z']+1.2;

        let la_2 = new THREE.Vector3(-0.8,0,1.2);
        camera_player_2.lookAt(la_2);

        const quaternion_2 = new THREE.Quaternion();
		quaternion_2.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI/2);
		camera_player_2.applyQuaternion( quaternion_2 );

    }
    
    if(event.key == 'b')
    {
        flag = 0;
    }
    else if(event.key == 'n')
    {
        flag = 1;
    }
    else if(event.key == 'm')
    {
        flag = 2;
    }

    else if(event.key == '1'){
        let meshPos = new THREE.Vector3()
        spotLight1.position['z']+=0.005
        spotLight1.getWorldPosition(meshPos)
        // console.log(meshPos);
    }

    else if(event.key == '2'){
        let meshPos = new THREE.Vector3()
        spotLight1.position['z']-=0.005
        spotLight1.getWorldPosition(meshPos)
        // console.log(meshPos);
    }

    else if(event.key == '3'){
        console.log(player2.position)
    }

    else if(event.key == 'f' && playerWithBall==player1) {
        incr = true
        count = 0
        animBall_dribble = true;
    }

    else if(event.key == 'j' && playerWithBall==player2) {
        incr = true
        count = 0
        animBall_dribble = true;
    }

    else if(event.key == 'g' && playerWithBall == player1)
    {
        let meshPos = new THREE.Vector3()
        ball.getWorldPosition(meshPos)
        scene.add(ball)
        ball.position.set(meshPos.x,meshPos.y,meshPos.z)
        animBall_kick = true
    }
    else if(event.key == "h" && playerWithBall == player2) 
    {
        let meshPos = new THREE.Vector3()
        ball.getWorldPosition(meshPos)
        scene.add(ball)
        ball.position.set(meshPos.x,meshPos.y,meshPos.z)
        animBall_kick = true
    }
}, false);

document.addEventListener('keyup', function (event)
{
    dictionary_keys[event.key] = false;
}, false);

let animBall_kick = false;
let animBall_dribble = false;
let playerWithBall
let incr = false;
let count = 0
let animBall_random = false
let initBall_pos, finalBall_pos

function animateBall(){
    if(!animBall_kick && !animBall_random && !animBall_dribble){
        return
    }

    else if(animBall_kick) {
        if(playerWithBall == player1){
            ball.position['x'] += 0.1
        } 
        else {
            ball.position['x'] -= 0.1
        }
        
        let pos = ball.position
        for(let i=0; i<obstacles.length; i++){
            let bbox = new THREE.Box3().setFromObject(obstacles[i])
            if(
                pos['x'] > bbox.min['x'] &&
                pos['x'] < bbox.max['x'] &&
                pos['y'] > bbox.min['y'] &&
                pos['y'] < bbox.max['y']
            ) {
                animBall_kick = false; 
                animBall_random = true;
                initBall_pos = [pos['x'],pos['y']]
                finalBall_pos = [-12.6,7.4]
                return
            }
            
        }
    ball.rotateZ(0.1)

    }

    else if (animBall_random) {
        let del_x
        let slope = (finalBall_pos[1]-initBall_pos[1])/(finalBall_pos[0]-initBall_pos[0])
        if(finalBall_pos[0] > initBall_pos[0]) {
            ball.position['x'] += 0.08
            del_x = 0.08
        } 
        
        else {
            ball.position['x'] -= 0.08
            del_x = -0.08
        }

        let del_y = slope * del_x
        ball.position['y'] += del_y 

    }

    else {
        if(incr){
            ball.position['z'] += 0.01
            count+=1
            if(count == 75){
                count = 0
                incr = false
            }
        }
        else{
            ball.position['z'] -= 0.01
            count+=1
            if(count == 75){
                count = 0
                incr = true
            }
        }
        ball.rotateZ(0.1)
    }
}

function refreshScreen() {
    let field = scene.getObjectByName("field")
    if(field == undefined || ball == undefined){
        return
    }
    let bbox = new THREE.Box3().setFromObject(field);
    let pos = ball.position
    if(
        pos['x'] < bbox.min['x'] ||
        pos['x'] > bbox.max['x'] ||
        pos['y'] < bbox.min['y'] ||
        pos['y'] > bbox.max['y']
    ) {
        window.location.reload();
    }
}

function animate() {
	requestAnimationFrame(animate);
    if(flag == 0)
    	renderer.render(scene, camera);
    else if(flag == 1)
        renderer.render(scene, camera_player_1);
    else
        renderer.render(scene, camera_player_2);
    controls.update();
    checkKeys();
    animateBall();
    refreshScreen();

}
animate();