//Estilos (solo 1)
import "../styles/App.scss";
//Librerías, datos y LS
import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ls from "../services/localStorage";
import getFromApi from "../services/api.js";
//Componentes
import CharacterList from "./CharacterList";
import Filters from "./Filters";
import CharacterDetail from "./CharacterDetail";

function App() {
  //VARIABLES DE ESTADO
  const [characters, setCharacters] = useState([]);
  const [houseFilter, setHouseFilter] = useState("Gryffindor");
  const [textFilter, setTextFilter] = useState("");

  //FUNCIONES AUXILIARES

  //fetch

  useEffect(() => {
    getFromApi().then((dataFromApi) => {
      console.log(dataFromApi);
      setCharacters(dataFromApi);
    });
  }, []);

  //obtener el id del personaje clicleado
  const { pathname } = useLocation();
  console.log(pathname);
  const dataPath = matchPath("/detail/:id", pathname);

  const characterId = dataPath !== null ? dataPath.params.id : null;
  const characterFound = characters.find((oneCharacter) => {
    return characterId === oneCharacter.id;
  });

  /*búscame en el listado completo el personaje que tenga el mismo id que characterId
  donde characterId es el id del personaje clicado por la usuaria (el que sale en la ruta)*/

  //RELACIONADAS CON LIFTING

  const handleFilterByHouse = (value) => {
    setHouseFilter(value);
  };

  const handleFilterByName = (value) => {
    setTextFilter(value);
  };

  //APLICACIÓN DE FILTROS

  const filteredCharacters = characters
    .filter((oneCharacter) => {
      return houseFilter === "All" ? true : oneCharacter.house === houseFilter;
    })
    .filter((oneCharacter) => {
      if (textFilter.length === 0) {
        return true;
      } else {
        return oneCharacter.name
          .toLowerCase()
          .includes(textFilter.toLowerCase());
      }
    });

  //RETURN Y RUTAS

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <form>
                <Filters
                  characters={characters}
                  houseFilter={houseFilter}
                  handleFilterByHouse={handleFilterByHouse}
                  textFilter={textFilter}
                  handleFilterByName={handleFilterByName}
                />
              </form>
              <CharacterList characters={filteredCharacters} />
            </>
          }
        />
        <Route
          path="/detail/:id"
          element={<CharacterDetail characterFound={characterFound} />}
        />
      </Routes>
    </div>
  );
}

export default App;
