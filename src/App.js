import React , { useState , useEffect , useCallback} from 'react';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {

  const [movies,setMovies] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(null);

  

  const fetchAPIHandler = useCallback(async () =>{
    try{
      setIsLoading(true);
      const response = await fetch('https://react-http-89cca-default-rtdb.europe-west1.firebasedatabase.app/movies.json');
      if(!response.ok){
        throw new Error('Something went wrong');
      }
      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);

    }catch(error){
      setError(error.message);
    }
      setIsLoading(false);
  },[]);

  useEffect(()=>{
    fetchAPIHandler();
  },[fetchAPIHandler]);

  let content = <p> No movies found </p>;
  if(isLoading){
    content = <p> Loading... </p>;
  }
  if(error){
    content = <p> Something went wrong... </p>;
  }
  if(movies.length > 0){
    content = <MoviesList movies={movies} />;
  }

  const addMovieHandler = async (movie) =>{
    const response = await fetch('https://react-http-89cca-default-rtdb.europe-west1.firebasedatabase.app/movies.json',{
      method:'POST',
      body:JSON.stringify(movie),
      headers:{
        'Content-Type':'application/json'
      }
    })

    const data = await response.json();
    console.log(data);
  }

  return (
    <React.Fragment>
      <section>
      <AddMovie onAddMovie = {addMovieHandler}/>
      </section>
      <section>
        <button onClick={ fetchAPIHandler }>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
