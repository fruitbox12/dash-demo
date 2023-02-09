var country_ips = [
	{
        "name": "United States",
        "amount": 18000
    },
	{
        "name": "China",
        "amount": 600
    },
	{
        "name": "Canada",
        "amount": 43
    },
	{
        "name": "Australia",
        "amount": 70
    },
	{
        "name": "Japan",
        "amount": 200
    },
	{
        "name": "India",
        "amount": 300
    },
	{
        "name": "Indonesia",
        "amount": 7
    },
	{
        "name": "Brazil",
        "amount": 10
    },
	{
        "name": "France",
        "amount": 100
    },
	{
        "name": "Madagascar",
        "amount": 500
    },
	{
        "name": "Saudi Arabia",
        "amount": 200
    },
	{
        "name": "Sweden",
        "amount": 100
    },
	{
        "name": "Spain",
        "amount": 900
    },
	{
		"name": "Russia",
		"amount": 500
	},
	{
		"name": "Mexico",
		"amount": 500
	},
	{
		"name": "Norway",
		"amount": 500
	},
	{
		"name": "New Zealand",
		"amount": 500
	},
	{
		"name": "Oman",
		"amount": 500
	},
	{
		"name": "Peru",
		"amount": 500
	},
	{
		"name": "Portugal",
		"amount": 500
	},
	{
		"name": "Palestine",
		"amount": 500
	},
	{
		"name": "Thailand",
		"amount": 500
	},
	{
		"name": "Swazilanda",
		"amount": 500
	},
	{
		"name": "Turkmenistan",
		"amount": 500
	},
	{
		"name": "Taiwan",
		"amount": 500
	}
]

// for ip amount gradient visualization
function level(value, total) {
	let percentage = value / total
	let break_points = [0.1, 0.25, 0.5, 0.75, 1]
	
	for (let i = 0; i < break_points.length; i++) {
		if (percentage <= break_points[i]) return i + 1
	}
}

var vm = new Vue({
	el: '#app',
	data: {
		select_citys: new Set(),
		citys_list: [],
		paths: null,
		svg: null,
		tl: null,
		now_city: 'Select any region',
		mouse_pos: {
			x: document.body.clientWidth / 4,
			y: document.body.clientHeight / 4
		},
		search: '',
		country_ips
	},
	methods: {
		setToList () {
			this.citys_list = Array.from(this.select_citys)
		},
		clearSelect () {
			this.select_citys.clear()
			this.citys_list = []
			
			for(let i = 0; i < this.paths.length; i++) {
				let el  = this.paths[i]
				
				if(el.classList.contains('clicked')) {
					el.classList.remove('clicked')
				}
			}
		},
		clearVisualize () {
			for(let i = 0; i < this.paths.length; i++) {
				let el = this.paths[i],
					 classList = el.classList
				
				classList.forEach((clsName) => {
					if(/level.*/.test(clsName)) {
						classList.remove(clsName)
					}
				})
			}
		},
		randomCountry () {
			let random_country = this.randomSlice(this.country_ips)
			
			random_country.forEach((item) => {
				if (item.name == 'United States' || item.name == 'China') {
					item.amount = parseInt(Math.random() * 3000 + 2000)
				} else {
					item.amount = parseInt(Math.random() * 200 + 100)
				}
			})
			
			this.updateMap(random_country)
		},
		randomSlice(array) {
			let len = array.length
			let starter = parseInt(Math.random() * len)
			let sliceArray = []
			let select_num = parseInt(len / 2)
			
			for(let i = starter; i < starter + select_num; i++) {
				sliceArray.push(array[(i % len)])
			}
			
			return sliceArray
		},
		level (value, total) {
			let percentage = value / total
			let break_points = [0.1, 0.25, 0.5, 0.75, 1]
	
			for (let i = 0; i < break_points.length; i++) {
				if (percentage <= break_points[i]) return i + 1
			}
		},
		updateMap (country_list) {
			this.clearVisualize()
			for (let i = 0; i < this.paths.length; i++) {
				let el = this.paths[i]
				let country_name = el.getAttribute('data-name')
				let level = ''
				
				// visualize amount
				let country = country_list.find((country) => {
					return country.name == country_name
				})

				if (country) {
					level = this.level(country.amount, this.total_ips)
					el.classList.add(`level${level}`)
				} else {
					el.classList.add('level0')
				}
			}
		},
		zoom (el) {
			let el_pos = el.getBBox(),
				 isClick = el.getAttribute('isClick')
				
			if (isClick === '1') {
				el.setAttribute('isClick', '0')
				vm.resetView()
			} else {
				el.setAttribute('isClick', '1')
				this.tl.to(this.svg, 2, {attr: {viewBox: `${el_pos.x - el_pos.width/2} ${el_pos.y - el_pos.height/2} ${el_pos.width*2} ${el_pos.height*2}`}})

			}
		},
		resetView () {
			this.tl.to(this.svg, 1, {attr: {viewBox: '0 0 2000 1000'}})
		}
	},
	computed: {
		country_tip_pos () {
			return {
				'left': `${this.mouse_pos.x}px`,
				'top': `${this.mouse_pos.y}px`
			}
		},
		last_click () {
			let len = this.citys_list.length
			return this.citys_list[len - 1]
		},
		list_empty () {
			return this.citys_list.length < 1
		},
		total_ips () {
			return this.country_ips.reduce((total, item) => {
				return total += item.amount
			}, 0)
		}
	},
	mounted () {
		var svg = this.svg = document.getElementsByTagName('svg')[0]
		var paths = this.paths = svg.getElementsByTagName('path')
		
		// svg zoom transition effect
		var tl = this.tl =  new TimelineMax()
		TweenLite.defaultEase = Sine.easeInOut;
		TweenLite.defaultOverwrite = false;
	
		// add event listener to each path
		for(let i = 0; i < paths.length; i++) {
			let el = paths[i]
			let country_name = el.getAttribute('data-name')
			
			// click event
			el.addEventListener('click', function(evt) {
				
				if (el.classList.contains('clicked')) {
					vm.select_citys.delete(country_name)
					el.classList.remove('clicked')
				} else {
					vm.select_citys.add(country_name)
					el.classList.add('clicked')
				}
				
				vm.setToList()
			})
			
			// double click event
			el.addEventListener('dblclick', function(evt){
					vm.zoom(el)
			})
			
			// hover event
			el.addEventListener('mouseenter', function(evt) {
				vm.now_city = country_name
				vm.mouse_pos = {
					x: evt.clientX,
					y: evt.clientY
				}
			})
		}
	}
})