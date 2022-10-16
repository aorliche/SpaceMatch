import * as f from '/js/functions.js';
import {Animator} from '/js/animator.js';
import {Grid} from '/js/grid.js';
import {Sounds} from '/js/sounds.js';

var $ = q => document.querySelector(q);
var $$ = q => [...document.squerySelectorAll(q)];

var grid, audio;
var images = [
    '/images/blast.png', 
    '/images/lost.png', 
    '/images/spacematch.png',
    '/images/astrons/atom.png',
    '/images/astrons/galaxy.png',
    '/images/astrons/moon.png',
    '/images/astrons/pinkmoon.png',
    '/images/astrons/planet.png',
    '/images/astrons/reddwarf.png',
    '/images/astrons/star.png',
    '/images/astrons/sun.png',
    '/images/characters/moon_big.png',
    '/images/characters/pinkmoon_big.png',
    '/images/characters/planet_big.png',
    '/images/characters/reddwarf_big.png',
    '/images/characters/star_big.png',
    '/images/characters/sun_big.png',
];
var sounds = [
    '/sounds/clear.mp3', 
    '/sounds/swap.mp3', 
    '/sounds/plus.mp3', 
    '/sounds/blast.mp3', 
    '/sounds/klaxon.mp3', 
    '/sounds/lost.mp3', 
    '/sounds/whoosh.flac'
];
var music = ['/sounds/space-loop.wav'];
var assets = {};
var nloaded = 0;

function loadImageCb(dict, src, img) {
   dict[f.basename(src)] = img;
   if (++nloaded == images.length) {
        startGame();
   }
}

function loadImage(dict, src) {
    const img = new Image();
    img.src = src;
    img.addEventListener('load', () => loadImageCb(dict, src, img));
}

window.addEventListener('load', e => {
    audio = new Sounds();
    images.forEach(src => loadImage(assets, src));
    sounds.forEach(src => audio.load(f.basename(src), src));
    music.forEach(src => audio.loadMusic(f.basename(src), src));
});

function startGame() {
    const canvas = $('canvas');
    const ctx = canvas.getContext('2d');
    grid = new Grid({
        dim: {w: canvas.width, h: canvas.height}, 
        type: 'hex', 
        irange: [-9,9], 
        jrange: [-9,9],
        size: 30, 
        angle: 0, 
        ctx: ctx, 
        assets: assets
    });
    const anim = new Animator(grid, ctx, {w: canvas.width, h: canvas.height});
    grid.audio = audio;
    anim.start();
    canvas.addEventListener('mouseout', e => {
        e.preventDefault();
        grid.mouseout();
    });
    // In screen coordinates
    canvas.addEventListener('mousemove', e => {
        e.preventDefault();
        const p = f.getCursorPosition(e);
        grid.mousemove(p);
    });
    // Click, in screen coordinates
    canvas.addEventListener('click', e => {
        e.preventDefault();
        const p = f.getCursorPosition(e);
        grid.click(p);
    });
    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
        const p = f.getCursorPosition(e);
        grid.contextmenu(p);
    });
}
