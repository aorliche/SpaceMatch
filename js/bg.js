
import * as f from '/js/functions.js';

// Parallax stars background
// https://codepen.io/sarazond/pen/LYGbwj
export class Background {
    constructor(params) {
        this.dim = {...params.dim};
        this.stars1 = this.init(200);
        this.stars2 = this.init(100);
        this.stars3 = this.init(50);
        this.sizes = [1,2,3];
        this.speeds = [0.3,0.2,0.1];
    }

    // screen coords
    draw(ctx) {
        // Draw space
        const grad = ctx.createLinearGradient(this.dim.w/2, this.dim.h, this.dim.w/2, 0);
        grad.addColorStop(0, '#3B3745');
        grad.addColorStop(1, '#090A0F');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,this.dim.w,this.dim.h);
        // Draw stars
        f.zip([this.stars1, this.stars2, this.stars3], this.sizes).forEach(pair => {
            const [stars, size] = pair;
            stars.forEach(star => {
                //throw 'bad';
                ctx.fillStyle = '#fff';
                ctx.fillRect(star.x, star.y, size, size);
            });
        });
    }

    init(n) {
        const stars = [];
        for (let i=0; i<n; i++) {
            stars.push(f.point(f.randint(0,this.dim.w), f.randint(0,this.dim.h)));
        }
        return stars;
    }

    tick() {
        f.zip([this.stars1, this.stars2, this.stars3], this.speeds).forEach(pair => {
            const [stars, speed] = pair;
            stars.forEach(star => {
                star.y -= speed;
                if (star.y < -10) {
                    star.x = f.randint(0, this.dim.w);
                    star.y = this.dim.h+10;
                }
            });
        });
    }
}
