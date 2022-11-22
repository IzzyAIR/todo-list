import {  createSlice } from "@reduxjs/toolkit"



const initialState = {
    list: [],
}
const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        /**
         * Функция для получения данных из сервера 
         * @param {object} state Текущее значение 
         * @param {object} action Полученное значение
         */
        getData(state, action) {
            state.list = action.payload;
        },
       
        /**
         * Функция для добавления данных в сервер 
         * @param {object} state Текущее значение 
         * @param {object} action Полученное значение
         */
        addItem(state, action) {
            state.list.push(action.payload);
        },
        /**
         * Функция для сохранения изменений в определённой задаче
         * @param {object} state Текущее значение 
         * @param {object} action Полученное значение
         */
        saveItemChanges(state, action){
            state.list = state.list.map(todo => todo.id === action.payload.id ? action.payload : todo);
        },
        /**
         * Функция для удаления определённых задач, задачи удаляются по id 
         * @param {object} state Текущее значение 
         * @param {object} action Полученное значение
         */
        deleteToDo(state, action) {
            state.list = state.list.filter(obj => obj.id !== action.payload);
        }
     
    }
});

export const selectListData = (state) => state.listSlice;

export const { addItem, getData, setLoading, saveItemChanges, deleteToDo } = listSlice.actions;

export default listSlice.reducer;