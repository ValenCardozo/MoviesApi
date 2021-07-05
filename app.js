const express = require('express');
const fs      = require('fs');
const app     = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.listen(3000, () => {
	console.log('Puerto 3000 activo');
});

app.get('/', function (request, response) {
	response.send('hi');
});

app.get('/movies', (request, response) => {
	getMovies(request, response);
});

app.post('/movies', (request, response) => {
	postMovies(request, response);
});

app.patch('/movie/:id', (request, response) => {
	patchMovies(request, response);
});

app.delete('/movie/:id', (request, response) => {
	deleteMovies(request, response);
});

function getMovies(request, response) {
	fs.readFile('movies.json', (error, file) => {
		if (error) {
			console.log('No se puede leer el archivo', error);
			return;
		}

		const movies = JSON.parse(file);
		return response.json(movies);
	});
}

function postMovies(request, response) {
	fs.readFile('movies.json', (error, data) => {

		if (error) {
			console.log('Error no se puede leer el archivo', error);
		}

		const movies = JSON.parse(data);
		console.log(data);
		const newMovieID = movies.length + 1;

		request.body.id = newMovieID;

		movies.push(request.body);

		const newMovie = JSON.stringify(movies, null, 2);

		fs.writeFile('movies.json', newMovie, (error) => {

			if (error) {
				console.log('Error no se puede leer el archivo', error);
			}

			return response.status(200).send('new movie added');
		})
	})
}

function patchMovies(request, response) {
	const mid = request.params.id;
	const {name, year} = request.body;

	fs.readFile('movies.json', (error, data) => {

		if (error) {
			console.log('Error no se puede leer el archivo', error);
		}

		const movies = JSON.parse(data);

		movies.forEach(movie => {

			if (movie.id === Number(mid)) {

				if (name != undefined) {
					movie.name = name;
				}

				if (year != undefined) {
					movie.year = year;
				}

				const movieUpdated = JSON.stringify(movies, null, 2);

				fs.writeFile('movies.json', movieUpdated, (error) => {

					if (error) {
						console.log('Error no se puede leer el archivo', error);
					}

					return response.status(200).json({message: 'movie updated'});
				})
			}
		})
	})
}

function deleteMovies(request, response) {
	const mid = request.params.id;

	fs.readFile('movies.json', (error, data) => {

		if (error) {
			console.log('Error no se puede leer el archivo', error);
		}

		const movies = JSON.parse(data);
		movies.forEach(movie => {

			if (movie.id === Number(mid)) {

				movies.splice(movies.indexOf(movie), 1);

				const movieDeleted = JSON.stringify(movies, null, 2);

				fs.writeFile('movies.json', movieDeleted, (error) => {

					if (error) {
						console.log('Error no se puede leer el archivo', error);
					}

					return response.status(200).json({message: 'movie deleted'});
				})
			}
		})
	})
}
