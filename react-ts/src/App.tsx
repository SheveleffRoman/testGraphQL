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
  const startQuery = 
  `query GetCharacters($page: Int) {
    characters(page: $page) {
      results {
        name
      }
    }
}`;

  const [query, setFieldName] = useState(startQuery);
  const [dataAxios, setDataAxios] = useState(null);

  const [value, setValue] = useState(startQuery);
  const [error, setError] = useState(null);
  const [endpoint, setEndpoint] = useState(
    "https://rickandmortyapi.com/graphql"
  );
  const [variables, setVariables] = useState("{}");

  const graphqlQuery = {
    operationName: "",
    query: `${value}`,
    variables: variables || "",
  };


  const fetchData = async () => {
    try {
      const parsed = JSON.parse(graphqlQuery.variables);
      const nameRegex = /query ([\w]+)/;
      const match = value.match(nameRegex)!;
      const response = await fetchAllData(endpoint, {
        ...graphqlQuery,
        operationName: match[1],
        variables: parsed,
      });
      setDataAxios(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };

  const handleClick = () => {
    setFieldName(value);
    fetchData();
  };

  const handleChangeEndpoint = (event: ChangeEvent<HTMLInputElement>) => {
    setEndpoint(event.target.value);
  };

  // const handleChangeVariables = (event: ChangeEvent<HTMLInputElement>) => {
  //   setVariables(event.target.value);
  // };

  const onChange = useCallback((val: string) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  const onChangeVariables = useCallback((val: string) => {
    console.log("val:", val);
    setVariables(val);
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
      <h5>Variables:</h5>
      <CodeMirror
        height="100px"
        width="700px"
        onChange={onChangeVariables}
        extensions={[langs.json()]}
        placeholder={'{"page": 5}'}
      />
      <button onClick={handleClick}>response</button>
      {error ? (
        <h2>{error.message}</h2>
      ) : (
        <>
          {!dataAxios && <></>}
          {dataAxios && <pre>{JSON.stringify(dataAxios, null, 2)}</pre>}
        </>
      )}
    </div>
  );
}

export default App;
