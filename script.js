const backgroundImg = './background.png'
const shopImg = './shop.png'

//Enemy Sprite
const kenjiIdle = './kenji/Idle.png';
const kenjiRun = './kenji/Run.png'
const kenjiJump = './kenji/Jump.png'
const kenjiFall = './kenji/Fall.png'
const kenjiAttack1 = './kenji/Attack1.png'
const kenjiTakeHit = './kenji/Take hit.png'
const kenjiDeath = './kenji/Death.png'

//Hero Sprite
const samuraiMackIdle = './samuraiMack/Idle.png';
const samuraiMackRun = './samuraiMack/Run.png'
const samuraiMackJump = './samuraiMack/Jump.png'
const samuraiMackFall = './samuraiMack/Fall.png'
const samuraiMackAttack1 = './samuraiMack/Attack1.png'
const samuraiMackTakeHit = './samuraiMack/Take Hit - white silhouette.png'
const samuraiMackDeath = './samuraiMack/Death.png'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 1024;
const canvasHeight = 576;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    }, 
    imageSrc: backgroundImg,
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    }, 
    imageSrc: shopImg,
    scale: 2.75,
    framesMax: 6,
})


const player = new Fifgter({
   position: { 
     x: 0,
     y: 0
   },
   velocity: {
       x: 0,
       y: 10
   },
//    offset: {
//        x: 0,
//        y: 0
//    },
   imageSrc: samuraiMackIdle,
   framesMax: 8,
   scale: 2.5,
   offset: {
        x: 215,
        y: 157
    },
   sprites: {
        idle: {
            imageSrc: samuraiMackIdle,
            framesMax: 8
        },
        run: {
            imageSrc: samuraiMackRun,
            framesMax: 8
        },
        jump: {
            imageSrc: samuraiMackJump,
            framesMax: 2
        },
        fall: {
            imageSrc: samuraiMackFall,
            framesMax: 2
        },
        attack1: {
            imageSrc: samuraiMackAttack1,
            framesMax: 6
        },
        takeHit: {
            imageSrc: samuraiMackTakeHit,
            framesMax: 4
        },
        death: {
            imageSrc: samuraiMackDeath,
            framesMax: 6
        }
   },

   attackBox: {
       offset: {
           x: 80,
           y: 40
       },
       width: 170,
       height: 50
   }
})

const enemy = new Fifgter({
    position: { 
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10
    },
    color: 'blue',
    offset: {
        x: 50,
        y: 0
    },
    imageSrc: kenjiIdle,
   framesMax: 4,
   scale: 2.5,
   offset: {
        x: 215,
        y: 167
    },
   sprites: {
        idle: {
            imageSrc: kenjiIdle,
            framesMax: 4
        },
        run: {
            imageSrc: kenjiRun,
            framesMax: 8
        },
        jump: {
            imageSrc: kenjiJump,
            framesMax: 2
        },
        fall: {
            imageSrc: kenjiFall,
            framesMax: 2
        },
        attack1: {
            imageSrc: kenjiAttack1,
            framesMax: 4
        },
        takeHit: {
            imageSrc: kenjiTakeHit,
            framesMax: 3
        },
        death: {
            imageSrc: kenjiDeath,
            framesMax: 7
        }
   },
   attackBox: {
    offset: {
        x: -175,
        y: 50
    },
    width: 175,
    height: 50
}
    //imageSrc: backgroundImg,
})

const keys = {
    keyA: {
        pressed: false,
    },
    keyD: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    }
}

decreaseTimer();

function animate() {
    requestAnimationFrame(animate)
    ctx.fillStyle = "white"
    ctx.imageSmoothingEnabled = false
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    background.update();
    shop.update();
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    

    //Player Movement
    
    if (keys.keyD.pressed && player.lastKey === "KeyD") {
        player.velocity.x = 5
        player.switchSprite('run')
    }else if(keys.keyA.pressed && player.lastKey === "KeyA") {
        player.velocity.x = -5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //Enemy Movement
    if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //Detect for Collison
    if (collisonDetector({
        rectangle1: player,
        rectangle2: enemy,
    }) && player.isAttacking && player.currentFrame === 4) {
       enemy.takeHit()
       player.isAttacking = false
       document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if(player.isAttacking && player.currentFrame === 4) {
        player.isAttacking = false
    }

    if (collisonDetector({
        rectangle1: enemy,
        rectangle2: player, 
    }) && enemy.isAttacking && enemy.currentFrame === 2) {
        player.takeHit()
       document.querySelector('#playerHealth').style.width = player.health + '%'; 
       enemy.isAttacking = false
    }

    if(enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false
    }

    //End the game base on health
    if (enemy.health <= 0 || player.health <= 0) {
        detamineWinner({player, enemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
    switch (event.code) {
        case "KeyA":
            keys.keyA.pressed = true
            player.lastKey = "KeyA"
            break;

        case "KeyW":
            player.velocity.y = -20
            break;

        case "KeyD":
           keys.keyD.pressed = true
           player.lastKey = "KeyD"
           break;
        case "Space":
           player.attack();
           break;

        }
}

        //Enemy Movement controls
        if (!enemy.dead) {
            switch (event.code) {
                case "ArrowRight":
                    keys.ArrowRight.pressed = true
                    enemy.lastKey = "ArrowRight"
                    break;
         
                 case "ArrowLeft":
                    keys.ArrowLeft.pressed = true
                    enemy.lastKey = "ArrowLeft"
                    break;
         
                 case "ArrowUp":
                    enemy.velocity.y = -20
                    break;
         
                 case "ArrowDown":
                    //enemy.isAttacking = true;
                    enemy.attack();
                    break;
               }
        }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case "KeyA":
            keys.keyA.pressed = false
            break;

         case "KeyD":
            keys.keyD.pressed = false
            break;

          //Enemy Movement controls
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            lastKey = "ArrowRight"
            break;
 
         case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            lastKey = "ArrowLeft"
            break;
    }
})