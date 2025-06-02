let l = 0, s = [], sc = [], scv = [], ds = null, mode = 0, cr = false, f = 2, rc = 24;	//Variables
let cells = document.querySelectorAll('cell'), inputs = document.querySelectorAll('input'), Container = document.getElementById('main'), PageNo = document.getElementById('no');
let rn = [], cn = [], cnode = [], txt = [], line = [[]], rnv = [], cnv = [], color = [], colorLine = [];

let r = 0, c = 0, i = 0, j = 0, head = "undefined", inputPN = document.getElementById('projectName'), name='';
let TotalLayer = 0;	PageNo.innerHTML = 0, layerList = [];

function getQueryParam(name) {	//when jump from Menu.html
	const urlParams = new URLSearchParams(window.location.search); 
	if (isNew){
		return urlParams.get(name);
	} else {
		return 0;
	}
}
let ratio = 0;
function getLabel () {
	eel.load_from_json('config.json')().then(cf => { rnv = cf.rowValue, cnv = cf.colValue; if ((r+c)==0) r = cf.row, c = cf.col;
	
	let wheight = document.documentElement.clientHeight-32, wwidth = document.documentElement.clientWidth-32, simp = 0;
	ratio = cf.rat;
	if (ratio>0) {let z = ratio * (r/c) * (155.75/148);
		if (wwidth/wheight> z){
			wwidth = (wheight) * z;
		} else {
			wheight = (wwidth) / z;
		}
	}
	
		
		Container = document.getElementById('main');	Container.style.height = `${wheight}px`;	Container.style.width = `${wwidth}px`;
		for (let C = 0; C < c; C++) {
			let cl = document.createElement('div');
			cl.className = 'ce';	cl.style.height = `${(wheight - rc) / c}px`;	cl.style.width = `${rc}px`;
			let span = document.createElement('span');
			span.className = 'rotated-text'; span.setAttribute('contenteditable', 'true');
			span.addEventListener('blur', function() {		savecf();		});
			cl.appendChild(span);	document.getElementById('column').appendChild(cl);
		}
		document.getElementById('column').style.height = `${wheight - rc}px`;	cn = Container.querySelectorAll('.rotated-text');	cnode = Container.querySelectorAll('.ce');
		for (let R=0;R<r;R++){
			let rl = document.createElement('div'); rl.setAttribute('contenteditable', 'true');
			rl.className = 're';	rl.style.height = `${rc}px`;	rl.style.width = `${(wwidth - rc) / r }px`;
			rl.addEventListener('blur', function() {		savecf();		});
			document.getElementById('row').appendChild(rl);
		}
		document.getElementById('row').style.width = `${wwidth - rc}px`;	rn = Container.querySelectorAll('.re');
		for (let L=0;L<r;L++) {	rn[L].innerHTML = rnv[L];	}	for (let L=0;L<c;L++) {	cn[L].innerHTML = cnv[L];	}
		
		getTableData ();
	}).catch(error => {
		console.error("Error loading data:", error);
	});
}
async function getTableData() {
	try {
		name = await eel.get_current_name()();
		inputPN.innerHTML = name; countLayer();
		inputPN.addEventListener('blur', function(){const text = inputPN.innerHTML.trim();
			if (text == '<br>'){inputPN.innerHTML = name} else if (text != name) {eel.rename_file(`Data/${name}`, `Data/${inputPN.innerHTML}`); name = inputPN.innerHTML;}
		})
		const result = await countLayer();
		console.log("countLayer output:", result);
		let [layerList, TotalLayer] = [result[0], result[1]]
		PageNo.innerHTML = layerList[l].split('.')[0];
		
		
		const data = await eel.load_from_json(layerList[l])();
		head = data.head;
		txt = data.txt;
		line = data.line;
		color = data.c;
		colorLine = data.cl;
		Table();
	} catch (error) {
		console.error("Error loading data:", error);
	}
}

async function getTableDataOnly() {
	const result = await countLayer();
	//console.log("countLayer output:", result, result[0][l], l);
	let [layerList, TotalLayer] = [result[0], result[1]];
	PageNo.innerHTML = layerList[l].split('.')[0];

	cells.forEach(cell => {cell.innerHTML = '', cell.removeAttribute('color')});
	eel.load_from_json(layerList[l])().then(data => {
		txt = data.txt;
		line = data.line;
		color = data.c;
		colorLine = data.cl;
		for (let n = 0; n < txt.length; n++) {
			if (line[n][1] == 0) {
				cells[line[n][0]].innerHTML = txt[n];
			}
			cells[line[n][0]].flip[line[n][1]] = txt[i];
		}
		for (let n=0;n<color.length;n++){
			cells[colorLine[n]].setAttribute('color', `${color[n]}`);
		}
	}).catch(error => {
		console.error("Error loading data:", error);
	});
}

function Table() {
	let wheight = document.documentElement.clientHeight-32;
	let wwidth = document.documentElement.clientWidth-32;
	if (ratio>0) {let z = ratio * (r/c) * (155.75/148);
		if (wwidth/wheight> z){
			wwidth = (wheight) * z;
		} else {
			wheight = (wwidth) / z;
		}
	}
	let table = document.getElementById('table');
	table.style.height = `${wheight - rc - 6}px`;
	table.style.width = `${wwidth - rc - 8}px`;
	if (typeof i === 'undefined') i = 0;

	for (let n = 0; n < c * r; n++) {
		let cell = document.createElement('div');
		cell.className = 'cell';
		cell.style.height = `${(wheight - 6 - rc) / c}px`;
		cell.style.width = `${(wwidth - 8 - rc) / r}px`;

		cell.addEventListener('click', function cellOnClick(event) {
			if (mode == 0) {
				navigator.clipboard.readText()
				.then(text => {
				console.log("Clipboard content:", text);

				let insert = "";
				const ytMatch = text.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w\-]+)/);
				if (ytMatch && ytMatch[1]) {
					const videoId = ytMatch[1];
					const embedUrl = `https://www.youtube.com/embed/${videoId}`;
					insert = `<iframe src="${embedUrl}" style="width:100%; height:calc(100% - 40px);" frameborder="0" allowfullscreen></iframe>`;
				} else {
					insert = text;
				}
				cell.innerHTML += insert;
				navigator.clipboard.writeText("").then(() => {
					console.log("Clipboard cleared");
				}).catch(err => {
					console.error("Failed to clear clipboard", err);
				});
				})
				.catch(err => {
					console.error("Failed to read clipboard", err);
				});
				
				
				if (event.ctrlKey) {
					cell.setAttribute('selected', 'true');
					//cell.querySelectorAll('*').forEach(el => el.style.pointerEvents = 'auto');
					s.push(n);
				} else {
					for (let n = 0; n < s.length; n++) {
						table.querySelectorAll(".cell")[s[n]].removeAttribute('selected');
						table.querySelectorAll(".cell")[s[n]].querySelectorAll('*').forEach(el => el.style.pointerEvents = 'none');
					}
					s = [];
					cell.setAttribute('selected', 'true');
					cell.querySelectorAll('*').forEach(el => el.style.pointerEvents = 'auto');
					s.push(n);
				}
			}
			if (cr) {
				for (let n = 0; n < s.length; n++) {
					cells[sc[n]].removeAttribute('carry');
					cells[sc[n]].innerHTML = cells[s[n]].innerHTML; console.log(cells[s[n]].flip, cells[sc[n]].flip);
					let cflip = cells[s[n]].flip;
					cells[s[n]].flip = cells[sc[n]].flip, cells[sc[n]].flip = cflip; console.log(cells[s[n]].flip, cells[sc[n]].flip)
					cells[s[n]].innerHTML = scv[n];
				} sc = []; scv = [];
			}
			cr = false;
		});
		if (f > 0 && !cell.flip) {
			cell.flip = [];
			for (let I = 0; I < f; I++) {
				cell.flip.push('');
			}
			cell.f = 0;
		}
		cell.addEventListener('contextmenu', function(){
			if (!cell.querySelector('textarea')){mode = 1;
				let input = document.createElement('textarea');
				input.value = cell.innerHTML; cell.innerHTML = '';
				input.style.width = cell.offsetWidth - 16 + "px";
				input.style.height = cell.offsetHeight - 16 + "px";
				cell.appendChild(input); input.focus();
				input.addEventListener("keydown", function (event) {
					const valueBefore = input.value.slice(0, input.selectionStart);
					const valueAfter = input.value.slice(input.selectionEnd);
					let insert = "", cursorPosOffset = 0;
					if (event.ctrlKey) {
						switch (event.key.toLowerCase()) {
							case "i": // Image
								event.preventDefault();
								insert = '<img src="" style="height: calc(100% - 40px)" />';
								cursorPosOffset = 10; // inside src=""
								break;
							case "b": // Video
								event.preventDefault();
								insert = '<video src="" controls style="height: calc(100% - 40px)"></video>';
								cursorPosOffset = 13;
								break;
							case "m": // Music
								event.preventDefault();
								insert = '<audio src="" controls></audio>';
								cursorPosOffset = 13;
								break;
							case "s": // Shortcut Link
								event.preventDefault();
								insert = '<a href="" target="_blank"></a>';
								cursorPosOffset = 9;
								break;
							case "f": // Iframe
								event.preventDefault();
								insert = '<iframe src="" style="width:100%; height:calc(100% - 40px);" frameborder="0" allowfullscreen></iframe>';
								cursorPosOffset = 13;
								break;
							case "y": // youtube
								event.preventDefault();
								insert = '<iframe src="https://youtube.com/embed/" style="width:100%; height:calc(100% - 40px);" frameborder="0" allowfullscreen></iframe>';
								cursorPosOffset = 39;
								break;
						}
					}
					if (insert) {
						input.value = valueBefore + insert + valueAfter;
						const cursorPos = valueBefore.length + cursorPosOffset;
						input.setSelectionRange(cursorPos, cursorPos);
					}
				});
				input.addEventListener('blur', function() {mode = 0;
					cell.innerHTML = input.value;
					cell.querySelectorAll('*').forEach(el => el.style.pointerEvents = 'none');
					cell.flip[cell.f] = cell.innerHTML;
					input.remove(); save();
				});
			}
		})
		table.appendChild(cell);

		// ✅ Safe access of data
		if (txt && line && txt.length - 1 >= i && line[i]) {
			if (line[i][0] == n) {
				if (line[i][1] == 0) {
					cell.innerHTML = txt[i];
				}
				cell.flip[line[i][1]] = txt[i];	i++;
			}
		}
		if (colorLine[j] == n && color.length-1 >= j) {cell.setAttribute('color', `${color[j]}`); j++}
	}
	cells = Container.querySelectorAll('.cell');
}

getLabel();		//startup Table

window.addEventListener('resize', function WindowOnResize() {
    let wheight = document.documentElement.clientHeight-32;
	let wwidth = document.documentElement.clientWidth-32;
	if (ratio>0) {let z = ratio * (r/c) * (155.75/148);
		if (wwidth/wheight> z){
			wwidth = (wheight) * z;
		} else {
			wheight = (wwidth) / z;
		}
	}
	let Container = document.getElementById('main');	//container of row, col and table
	Container.style.height = `${wheight}px`;
	Container.style.width = `${wwidth}px`;
	let table = document.getElementById('table');
	table.style.height = `${wheight-rc-6}px`;
	table.style.width = `${wwidth-rc-8}px`;
	for (let C=0;C<c;C++){
		cnode[C].style.height = `${(wheight-rc) / c }px`;
		cnode[C].style.width = `${rc}px`;
	}
	document.getElementById('column').style.height = `${wheight - rc}px`;
	for (let R=0;R<r;R++){
		rn[R].style.height = `${rc}px`;
		rn[R].style.width = `${(wwidth-rc) / r }px`;
	}
	document.getElementById('row').style.width = `${wwidth - rc}px`;
	
	for (let n=0;n<c*r;n++){
		cells[n].style.height = `${(wheight - 6 - rc) / c }px`;
		cells[n].style.width = `${(wwidth - 8 - rc) / r }px`;
	}
});

document.addEventListener('keydown', async function OnKeydown(event) {
	if (event.key == 'ArrowRight' || event.key == 'ArrowLeft' || event.key == 'ArrowUp' || event.key == 'ArrowDown') {
		let update = [], grantUpdate = true;
		for (let n = 0; n < s.length; n++) {	//transfrom to cell of arrow direction
			if (event.key === 'ArrowLeft') {
				update.push(s[n]-1);
				if (s[n] - 1 < 0) {
					grantUpdate = false;
				}
			}
			if (event.key === 'ArrowRight') {
				update.push(s[n]+1);
				if (s[n] + 1 >= cells.length) {
					grantUpdate = false;
				}
			}
			if (event.key === 'ArrowDown') {
				update.push(s[n]+r);
				if (s[n] + r >= cells.length) {
					grantUpdate = false;
				}
			}
			if (event.key === 'ArrowUp') {
				update.push(s[n]-r);
				if (s[n] - r < 0) {
					grantUpdate = false;
				}
			}
		}
		for (let n = 0; n < update.length; n++) {	//unselect current cell
			if (grantUpdate) {
				cells[s[n]].removeAttribute('selected');
			}
		}
		for (let n = 0; n < update.length; n++) {	//select cell of arrow direction
			if (grantUpdate) {
				s[n] = update[n];
				cells[s[n]].setAttribute('selected', 'true');
			}
		}
	}
	// if (event.key == 'e' && s.length > 0){ mode=1;	//edit cell
		// for (let n = 0; n < s.length; n++) {
			// if (!cells[s[n]].querySelector('textarea')){
				// let input = document.createElement('textarea');
				// input.value = cells[s[n]].innerHTML; cells[s[n]].innerHTML = '';
				// input.style.width = cells[s[n]].offsetWidth - 25 + "px";
				// input.style.height = cells[s[n]].offsetHeight - 25 + "px";
				// cells[s[n]].appendChild(input); input.focus();
				// inputs = document.querySelectorAll('textarea');
			// }
		// }
	// }
	// if (event.key == 'Enter'){						//confirm the edit
		// if (mode == 1){ mode=0;
			// for (let n = 0; n < s.length; n++) {
				// cells[s[n]].innerHTML = inputs[n].value;
				// cells[s[n]].flip[cells[s[n]].f] = cells[s[n]].innerHTML;
				// inputs[n].remove();
			// }
		// }
		// save()
	// }
	if (event.key == 't' && s.length > 0 && cr == false && mode == 0){ cr = true;	//transfar value cell to cell. BUGGY
		for (let n = 0; n < s.length; n++) {
			cells[s[n]].setAttribute('carry', 'true');
			sc.push(s[n]); scv.push(cells[s[n]].innerHTML);
		}
	}
    if (event.code === 'Numpad5' && f > 0) {		//flip the cell
        for (let n = 0; n < s.length; n++) {
            if (cells[s[n]].f >= cells[s[n]].flip.length-1) {
                cells[s[n]].f = 0;
				cells[s[n]].setAttribute("flipped", 'false');
            } else {
                cells[s[n]].f++;
				cells[s[n]].setAttribute("flipped", 'true');
            };
            cells[s[n]].innerHTML = cells[s[n]].flip[cells[s[n]].f];
        }
    }
	if (event.key == "PageDown" && l <= TotalLayer-2) {	l++; getTableDataOnly()}
	if (event.key == "PageUp" && l > 0) {				l--; getTableDataOnly()}
	if (event.key == "PageDown" && event.shiftKey && !event.repeat && l == TotalLayer-1) {		l++; txt = []; line = [];
		let New_data = {
			head: "",
			txt: [],
			line: [],
			c: [],
			cf: []
		}; console.log(New_data)
		eel.save_to_json(New_data, `${l+1}..json`); getTableDataOnly();
	}
	if (event.ctrlKey && event.key === 'x') {
        try {
            const result = await eel.save_and_cleanup_zip()();
			window.location.href = "Menu.html";
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("status").innerText = "Cleanup failed!";
        }
    }
	if (event.shiftKey){
		for (let n = 0; n < s.length; n++) {
			switch (event.key.toLowerCase()) {
				case "g":
					cells[s[n]].setAttribute('color', '1');save();
					break;
				case "a":
					cells[s[n]].setAttribute('color', '2');save();
					break;
				case "y":
					cells[s[n]].setAttribute('color', '3');save();
					break;
				case "p":
					cells[s[n]].setAttribute('color', '4');save();
					break;
				case "s":
					cells[s[n]].setAttribute('color', '5');save();
					break;
				case "b":
					cells[s[n]].setAttribute('color', '6');save();
					break;
				case "l":
					cells[s[n]].setAttribute('color', '7');save();
					break;
				case "r":
					cells[s[n]].setAttribute('color', '8');save();
					break;
				case "o":
					cells[s[n]].setAttribute('color', '9');save();
					break;
				case "v":
					cells[s[n]].setAttribute('color', '10');save();
					break;
				case 'q':
					cells[s[n]].removeAttribute('color');save();
					break;
			}
		}
	}
	if (event.key == '/' && !event.repeat) {
		const plate = document.querySelector('.plate');
		if (plate.style.display == 'none') {plate.style.display = 'block'} else {plate.style.display = 'none'}
}
});
async function countLayer() {
    try {
        const file = await eel.get_file_list(`Data/${name}`)();
        layerList = file;
        layerList.splice(layerList.indexOf('config.json'), 1);
        
        // Sort alphabetically or numerically
        layerList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); // Change numeric to false for strict A-Z sorting

        TotalLayer = layerList.length;
        console.log(layerList, TotalLayer);
        getLayerData(layerList, TotalLayer);
        return [layerList, TotalLayer];
    } catch (error) {
        console.error("Error fetching file list:", error);
        return [[], 0]; // Fallback values
    }
}


function getLayerData(layerList, TotalLayer) {console.log(layerList, TotalLayer);
	document.querySelector('tbody').innerHTML = '';
	for (let m = 0; m < TotalLayer; m++){
		document.querySelector('tbody').innerHTML += `<tr><td class="tno"><button>${layerList[m].split('.')[0]}</button></td><td class="tname" contenteditable="true" onblur="layerNameEdit(${m})">${layerList[m].split('.')[1]}</td><td class="tdel"><button onclick="deleteLayer(${m})">Delete</button></td><td><button onclick="jumpLayer(${m})">Open</button></td></tr>`
	}
}
function jumpLayer(m){l=m; getTableDataOnly()}
function deleteLayer(m){
	eel.delete(`Data/${name}/${layerList[m]}`);
	for (let k = m; k < TotalLayer - 1; k++) {
        const oldName = `${layerList[k+1].split('.')[0]}.${layerList[k].split('.')[1]}.json`;
        const newName = `${layerList[k].split('.')[0]}.${layerList[k].split('.')[1]}.json`;
        eel.rename_file(`Data/${name}/${oldName}`, `Data/${name}/${layerList[k]}`);
    }
	countLayer();
}
function layerNameEdit(m){	let oldName = layerList[m], newName = document.querySelectorAll('.tname')[m].textContent.trim();
	eel.rename_file(`Data/${name}/${oldName}`, `Data/${name}/${layerList[m].split('.')[0]}.${newName}.json`);
}
document.addEventListener('blur', function(){const text = inputLN.innerHTML.trim();
			if (text == '<br>'){inputLN.innerHTML = head} else if (text != head) {head = inputLN.innerHTML; save()}
		})
document.addEventListener('keyup', function OnKeyUp(event) {cr = false;
	if (event.key == 't'){
		for (let n = 0; n < s.length; n++) {
			cells[sc[n]].removeAttribute('carry');
			cells[sc[n]].innerHTML = cells[s[n]].innerHTML
			cells[s[n]].innerHTML = scv[n];
		} sc = []; scv = [];
	}
});

function save() {
	let arr = [], pos = [], col = [], cline = []; console.log('ok')
		for (let p=0;p<cells.length;p++){			//save as file
			for (let t=0;t<f;t++){
				if (cells[p].flip[t] != ''){
					arr.push(cells[p].flip[t]);
					pos.push([p,t]);
				}
			}
			if (cells[p].getAttribute('color')) {
				col.push(cells[p].getAttribute('color'))
				cline.push(p)
			}
		}
		let data = {
			head: head,
			txt: arr,
			line: pos,
			c: col,
			cl: cline
		}
		console.log("Data to save:", data);
		eel.save_to_json(data, `${l}.json`);
}
function savecf (){let rown = [], coln = [];
	for (let L=0;L<r;L++) {
		rown.push(rn[L].innerHTML)
	}
	for (let L=0;L<c;L++) {
		coln.push(cn[L].innerHTML)
	}
	let cf = {
			row: r,
			col: c,
			rat: ratio,
			rowValue: rown,
			colValue: coln
		}
	eel.save_to_json(cf, `config.json`);
}