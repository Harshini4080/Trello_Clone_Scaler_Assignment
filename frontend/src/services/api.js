import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Boards
export const getBoards = () => API.get("/boards");
export const createBoard = (title) => API.post("/boards", { title });

// Lists
export const getLists = (boardId) => API.get(`/boards/${boardId}/lists`);
export const createList = (data) => API.post("/lists", data);

// Cards
export const getCards = (listId) => API.get(`/lists/${listId}/cards`);
export const createCard = (data) => API.post("/cards", data);
export const moveCard = (data) => API.put("/cards/move", data);

export default API;
