import "./App.css";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { fetchAllData } from "./services/dataService";
import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from '@codemirror/lang-javascript';
import { langs } from "@uiw/codemirror-extensions-langs";

/* 
api: 
https://beta.pokeapi.co/graphql/v1beta


Запрос для покемон апи:


{
  gen1_species: pokemon_v2_pokemonspecies(
    where: { pokemon_v2_generation: { name: { _eq: "generation-i" } } }
    order_by: { id: asc }
  ) {
    name
    id
  }
}



*/

function App() {
  const startQuery = `
  {
    characters {
      results {
        name
      }
    }
  }
  `;

  const [query, setFieldName] = useState(startQuery);
  const [dataAxios, setDataAxios] = useState(null);

  const [value, setValue] = useState(startQuery);
  const [error, setError] = useState(null);
  const [endpoint, setEndpoint] = useState(
    "https://rickandmortyapi.com/graphql"
  );

  const graphqlQuery = {
    query: `query ${value}`,
    variables: {},
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllData(endpoint, graphqlQuery);
        setDataAxios(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [endpoint, query]);

  // const { data } = characterAPI.useGetCharactersQuery(query);

  const handleClick = () => {
    setFieldName(value);
  };

  const handleChangeEndpoint = (event: ChangeEvent<HTMLInputElement>) => {
    setEndpoint(event.target.value)
  }


  const onChange = useCallback((val: string) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  // if (isLoading) return "Loading...";
  // if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      <h1>GraphQL</h1>
      <input
        value={endpoint}
        style={{ width: "700px" }}
        type="text"
        // onClick={changeEndpoint}
        onChange={handleChangeEndpoint}
      />
      <CodeMirror
        height="200px"
        width="700px"
        onChange={onChange}
        value={value}
        extensions={[langs.json()]}
      />
      <button onClick={handleClick}>response</button>
      {error ? (
        <h2>{error.message}</h2>
      ) : (
        <pre>{JSON.stringify(dataAxios, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;

// const dataWithoutTypename = removeTypename(data);

// return (
//   <div>
//     <h1>Rick Morty Characters</h1>
//     <pre>{JSON.stringify(dataWithoutTypename, null, 2)}</pre>
//   </div>
// );

// function removeTypename(obj) {
//   if (obj === null || typeof obj !== "object") {
//     return obj;
//   }

//   if (Array.isArray(obj)) {
//     return obj.map((item) => removeTypename(item));
//   }

//   const newObj = {};
//   for (const key in obj) {
//     if (key !== "__typename") {
//       newObj[key] = removeTypename(obj[key]);
//     }
//   }

//   return newObj;
// }
