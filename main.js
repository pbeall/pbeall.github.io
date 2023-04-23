var themeSwitchCheckbox = document.querySelector(".themeSwitch input");

function updateTheme() {
	var nextTheme = themeSwitchCheckbox.checked ? "dark" : "light";
	
	document.querySelector("body").className = nextTheme;
	localStorage.setItem('theme', nextTheme);
}

//maintain the selected theme when switching pages:
themeSwitchCheckbox.checked = localStorage.getItem('theme') == 'dark';
updateTheme();



//tile background such that no tile is adjacent to a tile of the same or opposite color

function difference(set0, set1) {
	return new Set([...set0].filter(x => !set1.has(x)));
}

//represent a color by an integer in [0, 5]
const colorToName = [
	"white",
	"yellow",
	"orange",
	"red",
	"blue",
	"green"
]

//map a color to the set of colors which it cannot appear adjacent to
const colorToExcluded = [
	new Set([0,1]),
	new Set([1,0]),
	new Set([2,3]),
	new Set([3,2]),
	new Set([4,5]),
	new Set([5,4]),
	new Set() //noncolor
]

const colors = new Set([0, 1, 2, 3, 4, 5]);

var backgroundContainer = document.querySelector(".entire");
var insertBeforeThis = backgroundContainer.firstChild;

let backgroundContainerLeft = document.createElement("div");
backgroundContainerLeft.className = "backgroundContainerLeft";
let backgroundContainerRight = document.createElement("div");
backgroundContainerRight.className = "backgroundContainerRight";

backgroundContainer.insertBefore(backgroundContainerLeft, insertBeforeThis);
backgroundContainer.insertBefore(backgroundContainerRight, insertBeforeThis);

var colorLeft = 6;
var colorsAbove = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6];

for (let i=0; i<70; i++) {
	for (let j=0; j<10; j++) {
		let colorCandidates = difference(difference(colors, colorToExcluded[colorLeft]), colorToExcluded[colorsAbove[j]]);
		
		let chosenColor = 6;
		
		let k = colorCandidates.size;
		
		for (let colorCandidate of colorCandidates) {
			if (Math.random() < 1/k) {
				chosenColor = colorCandidate;
				break;
			}
			
			k--;
			
			/* Out of n candidates, the probability of the kth being chosen is
			(1-1/n)(1-1/(n-1))...(1-1/(n-k+1))(1/(n-k)) = ((n-1)/(n))((n-2)/(n-1))...((n-k)/(n-k+1))(1/(n-k)) = 1/n
			so all have an equal probability of being chosen, and exactly one will be chosen.*/
		}
		
		let newTile = document.createElement("div");
		newTile.className = "backgroundTile";
		newTile.style.float = j>4 ? "right" : "left";
		newTile.style.background = colorToName[chosenColor];
		
		/*if (j == 0){ 
			newTile.style.clear = "both";
		}*/
		
		colorLeft = chosenColor;
		colorsAbove[j] = chosenColor;
		
		if (j > 4) {
			backgroundContainerLeft.appendChild(newTile);
		}else {
			backgroundContainerRight.appendChild(newTile);
		}
		if (j == 4) {
			colorLeft = 6;
		}
	}
	
	colorLeft = 6;
}
