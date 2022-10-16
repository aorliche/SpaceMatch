
import * as f from './functions.js';

class Poly {
    constructor(params) {
        this.params = {...params};
        this.recalcBoundary();
    }

    contains(p) {
        for (let i=0; i<this.points.length; i++) {
            if (f.ccw(this.points[i], this.points[(i+1)%this.points.length], p) < 0) {
                return false;
            }
        }
        return true;
    }

    drawAstron(ctx, xform) {
        const center = xform(this.params.center);
        let mult = 1;
        /*if (this instanceof Tri) mult = 0.4;
        if (this instanceof Square) mult = 0.6;*/
        if (this.type == 'planet' || this.type == 'atom') mult = 1.3;
        // Sometimes params.image is undefined when blasting an edge poly
        // As that poly doesn't have a type, color, or image
        // This is okay for a stationary top-down grid
        try {
            let [w,h] = f.scaleImage(
                this.params.image.width, 
                this.params.image.height, 
                this.params.size*mult, 
                this.params.size*mult);
            ctx.drawImage(this.params.image, center.x-w/2, center.y-h/2, w, h);
        } catch (e) {}
    }

    drawCoords(ctx, xform) {
        const center = xform(this.params.center);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#000';
        ctx.fillText(this.params.pairstr, center.x, center.y);
    }

    drawHard(ctx, xform) {
        const center = xform(this.params.center);
        const tm = ctx.measureText(this.hard);
        const ascent = tm.actualBoundingBoxAscent;
        ctx.fillStyle = '#000';
        ctx.fillText(this.hard, center.x-tm.width/2, center.y+ascent/2);
    }

    drawSelected(ctx, xform) {
        this.makePath(ctx, xform);
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // xform is the screen transform (adjust center, flip y about center)
    draw(ctx, xform) {
        if (this.empty) {
            this.drawCoords(ctx, xform);
            return;
        }
        this.makePath(ctx, xform);
        ctx.fillStyle = this.params.color;
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
        if (this.params.color != '#fff') {
            this.drawAstron(ctx, xform);
        }
        if (this.hard) {
            this.drawHard(ctx, xform);
        }
        //this.drawCoords(ctx, xform);
    }

    // Flash poly
    flash() {
        const colSav = this.params.color;
        this.params.color = '#fff';
        window.setTimeout(e => {
            this.params.color = colSav;
        }, 50);
    }

    makePath(ctx, xform) {
        ctx.beginPath();
        const start = xform(this.points[0]);
        ctx.moveTo(start.x, start.y);
        this.points.map(p => {
            p = xform(p);
            ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
    }
}

export class Tri extends Poly {
    constructor(params) {
        super(params);
    }

    recalcBoundary() {
        this.points = [];
        const c = this.params.center;
        const size = this.params.size/Math.sqrt(3);
        const angle = this.params.angle;
        const invert = this.params.up ? 0 : Math.PI;
        for (let i=0; i<3; i++) {
            this.points.push({
                x: c.x + size*Math.cos(i*2*Math.PI/3+angle+invert+Math.PI/6), 
                y: c.y + size*Math.sin(i*2*Math.PI/3+angle+invert+Math.PI/6)
            });
        }
    }
}

export class Hex extends Poly {
    constructor(params) {
        super(params);
    }
    
    recalcBoundary() {
        this.points = [];
        const c = this.params.center;
        const size = this.params.size;
        const angle = this.params.angle;
        for (let i=0; i<6; i++) {
            this.points.push({
                x: c.x + size*Math.cos(i*Math.PI/3+angle+Math.PI/6), 
                y: c.y + size*Math.sin(i*Math.PI/3+angle+Math.PI/6)
            });
        }
    }
}

export class Square extends Poly {
    constructor(params) {
        super(params);
    }
    
    recalcBoundary() {
        this.points = [];
        const c = this.params.center;
        const size = this.params.size/Math.sqrt(2);
        const angle = this.params.angle;
        for (let i=0; i<4; i++) {
            this.points.push({
                x: c.x + size*Math.cos(i*Math.PI/2+angle+Math.PI/4), 
                y: c.y + size*Math.sin(i*Math.PI/2+angle+Math.PI/4)
            });
        }
    }
}

