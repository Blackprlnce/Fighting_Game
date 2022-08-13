
class Sprite{
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x:0,y:0} }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc
        this.scale = scale;
        this.framesMax = framesMax;
        this.currentFrame = 0;
        this.frameElapsed = 0;
        this.frameHold = 5;
        this.offset = offset;
        
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.currentFrame * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale ,
            this.image.height * this.scale,
        )
    }

    animateFrames() {
        this.frameElapsed++;
        if (this.frameElapsed % this.frameHold === 0) {
            if (this.currentFrame < this.framesMax - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames();
    }
}



class Fifgter extends Sprite {
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x:0,y:0},
        sprites,
        attackBox = {offset: {}, width: undefined, height: undefined}
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
        });

        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.health = 100;

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color;
        this.isAttacking;
        this.currentFrame = 0;
        this.frameElapsed = 0;
        this.frameHold = 5;
        this.sprites = sprites;
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

       
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames();
        

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        if (this.position.y + this.height + this.velocity.y >= canvasHeight - 94) {
            this.velocity.y = 0
            this.position.y = 332
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 10;
        if(this.health <= 0) {
            this.switchSprite('death')
        }else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.currentFrame === this.sprites.death.framesMax - 1) {
                this.dead = true;
            }
            return}


        if (this.image === this.sprites.attack1.image && this.currentFrame < this.sprites.attack1.framesMax - 1) return

        if (this.image === this.sprites.takeHit.image && this.currentFrame < this.sprites.takeHit.framesMax - 1) return
        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image){
                    this.framesMax = this.sprites.idle.framesMax
                    this.image = this.sprites.idle.image
                    this.currentFrame = 0;
                }
                break;
            case "run":
                if (this.image !== this.sprites.run.image){
                    this.framesMax = this.sprites.run.framesMax
                    this.image = this.sprites.run.image
                    this.currentFrame = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image){
                    this.framesMax = this.sprites.jump.framesMax
                    this.image = this.sprites.jump.image
                    this.currentFrame = 0;
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image){
                    this.framesMax = this.sprites.fall.framesMax
                    this.image = this.sprites.fall.image
                    this.currentFrame = 0;
                }
                break;
            case "attack1":
                if (this.image !== this.sprites.attack1.image){
                    this.framesMax = this.sprites.attack1.framesMax
                    this.image = this.sprites.attack1.image
                    this.currentFrame = 0;
                }
                break;
            case "takeHit":
                if (this.image !== this.sprites.takeHit.image){
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.image = this.sprites.takeHit.image
                    this.currentFrame = 0;
                }
                break;
            case "death":
                if (this.image !== this.sprites.death.image){
                    this.framesMax = this.sprites.death.framesMax
                    this.image = this.sprites.death.image
                    this.currentFrame = 0;
                }
                break;
        }
    }
}