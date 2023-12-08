import { createApi } from "@reduxjs/toolkit/query/react";
// import { request, gql, ClientError } from "graphql-request";
import axios from "axios";

/**** RTK Query ****/

const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ body }: { body: string }) => {
    try {
      const result = await request(baseUrl, body);
      return { data: result };
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, data: error } };
      }
      return { error: { status: 500, data: error } };
    }
  };

export const characterAPI = createApi({
  reducerPath: "characterAPI",
  baseQuery: graphqlBaseQuery({
    baseUrl: "https://rickandmortyapi.com/graphql",
  }),
  endpoints: (build) => ({
    getCharacters: build.query({
      query: (query) => ({
        body: gql`
          query {
            ${query}
          }
        `,
      }),
    }),
  }),
});

/**** Axios ****/

// const endPoint = "https://rickandmortyapi.com/graphql";
const token = "";
const headers = {
  "Content-Type": "application/json",
  token: token,
};

export const fetchAllData = (endpoint: string, graphqlQuery: object) => {
  const response = axios({
    url: endpoint,
    method: "post",
    data: graphqlQuery,
    headers: headers,
  });
  return response;
};
