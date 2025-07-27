var themeSwitchCheckbox = document.querySelector(".themeSwitch input");

function updateTheme() {
	var nextTheme = themeSwitchCheckbox.checked ? "light" : "dark";
	
	document.querySelector("body").className = nextTheme;
	localStorage.setItem('theme', nextTheme);
}

//maintain the selected theme when switching pages:
themeSwitchCheckbox.checked = localStorage.getItem('theme') == 'light';
updateTheme();

//each page should have the same buttons in the topbar:
const navigation = [
	{link: "index.html", displayName: "Activities"},
	{link: "joke.html", displayName: "Memes"},
	{link: "emoji.html", displayName: "Emojis"}
]

var topbar = document.querySelector("div.topbar > div");
var currentLink = location.href.split("/").slice(-1).toString().trim(); 

for (let i=0; i<navigation.length; i++) {
	let newNavButton = document.createElement("a");
	newNavButton.href = navigation[i]["link"]
	newNavButton.innerHTML = navigation[i]["displayName"]
	
	if (navigation[i]["link"] === currentLink) {
		newNavButton.className = "selected";
	}
	
	topbar.appendChild(newNavButton);
}

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
	new Set() //placeholder color
]

//number of colors, and also placeholder color
const numColors = colorToName.length;//should equal colorToExcluded.length - 1

const colors = new Set();
for (i=0; i<numColors; i++) {
	colors.add(i);
}

var backgroundContainer = document.querySelector(".entire");
var insertBeforeThis = backgroundContainer.firstChild;

let backgroundContainerLeft = document.createElement("div");
backgroundContainerLeft.className = "backgroundContainerLeft";
let backgroundContainerRight = document.createElement("div");
backgroundContainerRight.className = "backgroundContainerRight";

backgroundContainer.insertBefore(backgroundContainerLeft, insertBeforeThis);
backgroundContainer.insertBefore(backgroundContainerRight, insertBeforeThis);

var colorLeft = numColors;
var colorsAbove = Array(10).fill(numColors);

for (let i=0; i<90; i++) {
	for (let j=0; j<10; j++) {
		let colorCandidates = difference(difference(colors, colorToExcluded[colorLeft]), colorToExcluded[colorsAbove[j]]);
		
		let chosenColor = numColors;
		
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
			colorLeft = numColors;
		}
	}
	
	colorLeft = numColors;
}

/*
var emojiTable = document.querySelector(".emoji");

var emojiData = [
  { heading1:"value1_1",heading2:"value2_1",heading3:"value3_1",heading4:"value4_1",heading5:"value5_1" },
  { heading1:"value1_2",heading2:"value2_2",heading3:"value3_2",heading4:"value4_2",heading5:"value5_2" }
];

for (i in emojiData) {
	const leftData  = emojiData[i].emoji;
	const rightData = emojiData[i].description;
	const tr = emojiTable.insertRow();
	
	const td0 = tr.insertCell();
	p0 = document.createElement("p");
	p0.innerHTML = "AAA";//leftData;
	td0.appendChild(p0);
	
	const td1 = tr.insertCell();
	p1 = document.createElement("p");
	p1.innerHTML = rightData;
	td1.appendChild(p1);
}
*/