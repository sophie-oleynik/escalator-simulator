
new Vue({
	el: '#app',
	data: () => ({
		time: null,
		simulationInterval: null,
		logs: [],

		isGuests: false,
		escalator: {
			speed: 20,
			isWorking: false,
			r: {
				direction: 'В',
				contain: 0,
				newGuests: 0,
				left: 0
			},
			l: {
				direction: 'Н',
				contain: 0,
				newGuests: 0,
				left: 0
			}
		}
	}),
	methods: {
		startSimulation() {
			const self = this;
			this.time = '00:00'
			this.logs = [];
			
			this.addLog('START SIMULATION')
			this.simulationInterval = setInterval((self) => {
				if(self.time === "23:35") {
					self.isGuests = false
					self.addLog(`Escalator will close after 20 minutes`)
					self.escalator.l.newGuests = 0
					self.escalator.r.newGuests = 0
				} 
				if(self.time === "23:55") {
					self.stopEscalator();
					self.escalator.r.left = 0
					self.escalator.l.left = 0
						self.changeDirection();
				}
				if(self.time === "00:00") {
					self.startEscalator();
				}

				self.incrementTime()
				
				if(self.isGuests) {
					let l_guests = self.generateGuests();
					let r_guests = self.generateGuests();
					this.escalator.r.contain += r_guests;
					this.escalator.r.newGuests = r_guests;
					this.escalator.l.contain += l_guests;
					this.escalator.l.newGuests = l_guests;

					if(this.escalator.l.contain > 50 || this.escalator.r.contain > 50) {
						this.addLog('ESCALATOR OVERLOADED!!!')
						this.stopEscalator();
					}

					setTimeout((self, num) => { 
						self.escalator.l.contain -= num; 
						self.escalator.l.left = num; 
					}, self.escalator.speed * 1000, self, l_guests);
					setTimeout((self, num) => { 
						self.escalator.r.contain -= num; 
						self.escalator.r.left = num; 
					 }, self.escalator.speed * 1000, self, r_guests);
				}
			}, 1000, self);
		},
		stopSimulation() {
			this.addLog('STOP SIMULATION')
			clearInterval(this.simulationInterval)
		},
		danger() {
			this.addLog(`DANGER!!!`)
			this.stopEscalator()
		},
		generateGuests() {
			let hours = Number(this.time.slice(0, 2));
			return Math.ceil((hours >= 18 && hours < 19 ? 6 : 3) * Math.random())
		},
		addLog(text) {
			let message = this.time + ' ' + text;
			this.logs.unshift(message)
		},
		incrementTime(){
			let hours = Number(this.time.split(":")[0]); 
			let minutes = Number(this.time.split(":")[1]);

			if(minutes === 59) {
				minutes = 0
					if(hours !== 23) {
						hours++
					} else {
						hours = 0
					}
			} else {
				minutes++
			}
			this.time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
		},

		startEscalator() {
			this.escalator.isWorking = true
			this.isGuests = true
			this.addLog(`Start Escalator`)

		},
		stopEscalator() {
			this.escalator.isWorking = false
			this.isGuests = false
			this.addLog(`Stop Escalator`)

		},
		changeDirection() {
			this.escalator.l.direction = this.escalator.l.direction === "В" ? "Н" : "В" 		
			this.escalator.r.direction = this.escalator.r.direction === "В" ? "Н" : "В" 		
			this.addLog(`Change Direction`)
		}
	},
})