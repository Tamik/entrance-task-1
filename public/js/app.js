/* jshint esversion: 6 */

var modal = {
	"photo": document.getElementById('modal-photo'),
	"name": document.getElementById('modal-name'),
	"company": document.getElementById('modal-company'),
	"description": document.getElementById('modal-description')
};

var form = document.forms.typeFilter,
	typeChoose = form.typeChoose,
	typeInput = form.typeInput,
	timeStartInput = form.timeStart,
	timeEndInput = form.timeEnd;

var resetSchedule = document.getElementById('reset'),
	schedule = document.getElementById('schedule'),
	filterSwitcher = document.getElementById('filterSwitcher');

var standartTime = {
	"start": "01.01.2016 10:00",
	"end": "31.12.2016 10:00"
};

/*
 * Данная функция была написана, так как Safari не поддерживает options в toLocaleString().
 * @param {number} month
 * @returns {string}
 */
function parseMonth(month) {
	switch(month) {
		case 0: return 'январь';
		case 1: return 'февраль';
		case 2: return 'март';
		case 3: return 'апрель';
		case 4: return 'май';
		case 5: return 'июнь';
		case 6: return 'июль';
		case 7: return 'август';
		case 8: return 'сентябрь';
		case 9: return 'октябрь';
		case 10: return 'ноябрь';
		case 11: return 'декабрь';
	}
}

/*
 * @param {Array} schools
 * @returns {string}
 */
function parseSchools(schools) {
	var output;
	for(var i = 0; i < schools.length; i++) {
		if(i === 0) {
			output = schools[i] + ', ';
		}
		else if(i+1 == schools.length) {
			output += schools[i];
		}
		else {
			output += schools[i] + ', ';
		}
	}
	return output;
}

/*
 * @param {Object} list
 * @returns {string}
 */
function scheduleRow(list) {
	var t = teacher._get(list.teacher);
	var s;
	if(list.link === '') {
		list.link = '#';
	}
	if(list.passed) {
		s = '<div class="schedule-row">\n<div class="schedule-col date">\n<span>' + list.time.start.getDate() + '</span>\n</div>\n<div class="schedule-col title">\n<span class="title">\n<a href="' + list.link + '">Лекция ' + list.id + '. ' + list.name + '</a>\n</span>\n<span class="auditorium">' + list.auditorium + '</span>\n<span class="schools">' + parseSchools(list.schools) + '</span>\n</div>\n<div class="schedule-col speakers"><span class="speaker">\n<a href="#modal" data-name="' + t.name + '" data-photo="' + t.photo + '" data-company="' + t.company + '">' + list.teacher + '</a>\n</span>\n<span class="company">' + t.company + '</span>\n</div>\n</div>';
	}
	else {
		s = '<div class="schedule-row">\n<div class="schedule-col date">\n<span>' + list.time.start.getDate() + '</span>\n</div>\n<div class="schedule-col title">\n<span class="title">Лекция ' + list.id + '. ' + list.name + '</span>\n<span class="auditorium">' + list.auditorium + '</span>\n<span class="schools">' + parseSchools(list.schools) + '</span>\n</div>\n<div class="schedule-col speakers"><span class="speaker">\n<a href="#modal" data-name="' + t.name + '" data-photo="' + t.photo + '" data-company="' + t.company + '">' + list.teacher + '</a>\n</span>\n<span class="company">' + t.company + '</span>\n</div>\n</div>';
	}
	return s;
}

/*
 * @param {Array} list
 */
function buildSchedule(list) {
	schedule.innerHTML = '';
	for(var i = 0; i < list.length; i++) {
		if(i === 0) {
			schedule.innerHTML += '<div class="schedule-section"><span>' + parseMonth(list[i].time.start.getMonth()) + ' ' + list[i].time.start.getFullYear() + '</span></div>';
		}
		else if(i !== 0) {
			if(list[i-1].time.start.getMonth() < list[i].time.start.getMonth()) {
				schedule.innerHTML += '<div class="schedule-section"><span>' + parseMonth(list[i].time.start.getMonth()) + ' ' + list[i].time.start.getFullYear() + '</span></div>';
			}
		}
		schedule.innerHTML += scheduleRow(list[i]);
	}
}

function init() {
	buildSchedule(lecture.getAll());
}

filterSwitcher.onclick = function(event) {
	if(form.classList.contains('active')) {
		filterSwitcher.classList.remove('active');
		form.classList.remove('active');
		form.style.display = 'none';
	}
	else {
		filterSwitcher.classList.add('active');
		form.classList.add('active');
		form.style.display = 'block';
	}
};

document.onclick = function(event) {
	var elem = event.target;
	if(elem.tagName.toLowerCase() == 'a') {
		if(elem.getAttribute('href') == '#modal') {
			if(elem.hasAttribute('data-name') && elem.hasAttribute('data-photo')) {
				modal.photo.src = elem.getAttribute('data-photo');
				modal.name.innerHTML = elem.getAttribute('data-name');

				if(elem.hasAttribute('data-company')) {
					modal.company.innerHTML = elem.getAttribute('data-company');
				}

				modal.description.innerHTML = teacher._get(elem.getAttribute('data-name')).description;
			}
		}
		else if(elem.getAttribute('href') == '#close') {
			modal.name.innerHTML = '{name}';
			modal.company.innerHTML = '{company}';
			modal.description.innerHTML = '{description}';
		}
	}
};

form.onsubmit = function(event) {
	var time, t1, t2;
	t1 = timeStartInput.value || standartTime.start;
	t2 = timeEndInput.value || standartTime.end;
	time = t1 + ', ' + t2;
	switch(typeChoose.selectedIndex) {
		case 0: buildSchedule(lecture.search(time));
		break;
		case 1: buildSchedule(teacher.search(typeInput.value, time));
		break;
		case 2: buildSchedule(school.search(typeInput.value, time));
		break;
		case 3: buildSchedule(auditorium.search(typeInput.value, time));
		break;
		default: return false;
	}
	event.preventDefault();
};

resetSchedule.onclick = function() {
	typeChoose.selectedIndex = 0;
	typeInput.value = '';
	init();
};

document.addEventListener("DOMContentLoaded", function() {
	init();
});
