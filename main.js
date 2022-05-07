// Инициализируем класс Engine
class Engine {
	// Инициализируем конструктор класса
	// Canvas ссылка на тег в html документе
	// Size абсолютная едю измерения
	constructor(canvas, size = 10) {
		// Инициализируем поля класса полученные из конструктора
		this.size = size
		// Получаем контекст тега canvas (для рисования плоских фигур)
		this.ctx = canvas.getContext('2d')

		// Последовательно вызываем методы класса
		// Растягивает canvas по ширине и высоте
		this.calcSize()
		// Создает рандомный двумерный массив
		this.createRandArr()
		// Закрашивает Canvas в соответствии с массивом
		this.paint()
		// Запускает интервал в котором просчитывается вся логика игры
		this.start()
	}

	// Закрашивание квадрата в соответствии с параметрами
	// Col - колонка в которой разместится квадрат
	// Row - строка
	// Color - цвет квадрата
	// Padding - Отступы вокруг квадрата
	rect(col, row, color, padding = 2) {
		this.ctx.fillStyle = color
		this.ctx.fillRect(col - padding, row - padding, this.size - padding, this.size - padding)
	}

	// Создание рандомного двумерного массива и сохранение его в переменную
	/* Вида
	[
		[true,true,false],
		[false,true,false],
		[false,false,true]
	]
	*/
	createRandArr() {
		this.arr = new Array(this.width).fill([]).map(() => new Array(this.height)
			.fill(false).map(() => Math.random() < 0.5))
	}

	// Проходимся циклами по двумерному массиву и
	// закрашиваем квадрат в соотвествии true or false,
	// Если true то клетка жива и красится в цвет 'crimson'
	// иначе клетка мертва и красится в черный цвет
	paint() {
		for (let col = 0; col < this.arr.length; col++) {
			for (let row = 0; row < this.arr.length; row++) {
				const color = this.arr[col][row] ? 'crimson' : 'black'

				this.rect(col * this.size, row * this.size, color)
			}
		}
	}

	// Для дебага программы закрашивает в клетке её коордитнаты
	textCoordinate(text, col, row) {
		this.ctx.font = '14px Arial ';
		this.ctx.fillStyle = "white";
		const coordinate = `${col}:${row}-${text}`
		this.ctx.fillText(coordinate, col * this.size + 10, row * this.size - this.size / 2);
	}

	// Вычисляет размеры документа
	calcSize() {
		this.width = Math.round(window.innerWidth / this.size)
		this.height = Math.round(window.innerHeight / this.size)
		canvas.height = window.innerHeight
		canvas.width = window.innerWidth
	}

	// Запускает скрипт по просчету следующих поколений
	start() {
		this.start = true
	}

	// Останавливает скрипт
	stop() {
		this.start = false
	}

	// Метод считает сколько соседей у той или иной клетки
	calcLife(colY, rowX) {
		let count = 0
		for (let y = -1; y < 2; y++) {
			for (let x = -1; x < 2; x++) {
				if (y === 0 && x === 0) continue

				const col = (colY + y + this.height) % this.height
				const row = (rowX + x + this.width) % this.width

				const hasLife = this.arr[col][row]
				if (hasLife) count++
			}
		}
		return count
	}

	// Метод который просчитывает следующие поколение
	nextGen() {
		const newArr = this.arr.map(arr => [...arr])

		for (let y = 0; y < newArr.length; y++) {
			for (let x = 0; x < newArr[y].length; x++) {
				const countLife = this.calcLife(y, x)

				const hasLife = newArr[y][x]

				if (!hasLife && countLife === 3) newArr[y][x] = true
				else if (hasLife && countLife < 2) newArr[y][x] = false
				else if (hasLife && countLife > 3) newArr[y][x] = false
			}
		}
		this.arr = newArr
	}

	// Метод запускающий интервал в котором ведется просчет след. поколений
	render(speed = 300) {
		if (!this.start) return

		setInterval(() => {
			console.time('time-Thread')

			this.paint()
			this.nextGen()

			console.timeEnd('time-Thread')
		}, speed)
	}
}
// Берем ссылку на элемент canvas
const canvas = document.getElementById('canvas')
// Создаем экземпляр класса
const app = new Engine(canvas, 5)
// Запускаем просчет поколений
app.render(0)