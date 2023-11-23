
// Should be in a common file, but too lazy to refactor
const $ = q => document.querySelector(q);
const $$ = q => [...document.squerySelectorAll(q)];

export class Scoreboard {
    constructor() {
        this.scores = null;
        this.displayed = false;
        this.myscore = -1;
        // Load and display high scores table
        this.updateTable();
        $('#submit').addEventListener('click', () => {
            fetch('update.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: $('#name').value,
                    score: this.myscore
                })
            }).then(() => {
                this.updateTable();
            });
            $('#new-score').style.display = 'none';
        });
    }

    displayNameRequest() {
        $('#new-score').style.display = 'block';
    }

    fetchScores() {
        const promise =  
        fetch('scores.json')
        .then(res => res.json())
        .then(scores => {
            this.scores = scores;
            this.scores.sort((a,b) => {
                return b.score - a.score; 
            });
            if (this.scores.length >= 10) {
                this.cutoff = this.scores[9].score;
            } else {
                this.cutoff = -1;
            }
        });
        return promise;
    }

    maybeRecordScore(score) {
        if (this.displayed) return;
        this.displayed = true;
        this.fetchScores()
        .then(() => {
            if (score > this.cutoff) {
                this.myscore = score;
                this.displayNameRequest();
            }
        });
    }

    reset() {
        this.displayed = false;
    }

    updateTable() {
        this.fetchScores()
        .then(() => {
            const tab = $('#high-scores table');
            tab.innerHTML = '';
            for (let i=0; i<this.scores.length; i++) {
                if (i >= 10) break;
                const tr = document.createElement('tr');
                const name = document.createElement('td');
                const score = document.createElement('td');
                name.innerText = this.scores[i].name;
                score.innerText = this.scores[i].score;
                tr.appendChild(name);
                tr.appendChild(score);
                tab.appendChild(tr);
            }
        });
    }
}
