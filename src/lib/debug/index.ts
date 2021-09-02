export const tappedLog = (e: TouchEvent): boolean => {
	return !!(e.target as HTMLElement)?.closest?.('#log');
}

// console.log simulator for debugging on tablet/mobile
export const log = (logResult: string, overwrite: boolean = false, stick: boolean = false): void => {
	const createDiv = (): HTMLDivElement => {
		const containerDiv = document.createElement('div');
		const stickySpan = document.createElement('span');
		const innerDiv = document.createElement('div');
		const button = document.createElement('button');
		button.innerHTML = '×';
		button.onclick = () => document.body.removeChild(containerDiv);
		containerDiv.id = 'log';
		containerDiv.onmousedown = () => containerDiv.classList.toggle('expanded');
		containerDiv.appendChild(stickySpan);
		containerDiv.appendChild(innerDiv);
		containerDiv.appendChild(button);
		document.body.appendChild(containerDiv);
		return innerDiv;
	}
	const span = document.querySelector('#log > span') ?? createDiv();
	const div = document.querySelector('#log > div') ?? createDiv();
	if (stick) {
		span.innerHTML = `> ${logResult}`;
	} else if (overwrite) {
		div.innerHTML = `> ${logResult}`;
	} else {
		div.innerHTML += `<br>> ${logResult}`;
	}
}